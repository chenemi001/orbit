import { and, ilike, inArray } from "drizzle-orm";

import { requireUser } from "@/lib/auth";
import { errorResponse, success } from "@/lib/api/response";
import { db } from "@/lib/db";
import { projects, tasks } from "@/lib/db/schema";
import { getProjectsForUser } from "@/lib/services/project.service";
import { getTeamForUser } from "@/lib/services/team.service";

interface SearchResult {
  id: string;
  type: "task" | "project" | "user";
  title: string;
  subtitle?: string;
  href: string;
}

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") ?? "").trim();

    if (query.length < 2) {
      return success<SearchResult[]>([]);
    }

    const projectRows = await getProjectsForUser(user.id);
    const projectIds = projectRows.map((project) => project.id);

    const results: SearchResult[] = [];

    if (projectIds.length > 0) {
      const [matchingProjects, matchingTasks] = await Promise.all([
        db
          .select({ id: projects.id, name: projects.name })
          .from(projects)
          .where(
            and(
              inArray(projects.id, projectIds),
              ilike(projects.name, `%${query}%`),
            ),
          )
          .limit(5),

        db
          .select({
            id: tasks.id,
            title: tasks.title,
            projectId: tasks.projectId,
          })
          .from(tasks)
          .where(
            and(
              inArray(tasks.projectId, projectIds),
              ilike(tasks.title, `%${query}%`),
            ),
          )
          .limit(5),
      ]);

      const projectNameById = new Map(
        projectRows.map((project) => [project.id, project.name]),
      );

      results.push(
        ...matchingProjects.map((project) => ({
          id: project.id,
          type: "project" as const,
          title: project.name,
          href: `/projects/${project.id}`,
        })),
      );

      results.push(
        ...matchingTasks.map((task) => ({
          id: task.id,
          type: "task" as const,
          title: task.title,
          subtitle: projectNameById.get(task.projectId),
          href: `/projects/${task.projectId}?tab=tasks&taskId=${task.id}`,
        })),
      );
    }

    const team = await getTeamForUser(user.id);
    const matchingPeople = team
      .filter(
        (member) =>
          member.name.toLowerCase().includes(query.toLowerCase()) ||
          member.email.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 5);

    results.push(
      ...matchingPeople.map((member) => ({
        id: member.id,
        type: "user" as const,
        title: member.name,
        subtitle: member.email,
        href: `/team`,
      })),
    );

    return success(results);
  } catch (error) {
    return errorResponse(error);
  }
}
