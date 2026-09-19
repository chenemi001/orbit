import { and, inArray, isNotNull, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { projectMembers, tasks, users } from "@/lib/db/schema";
import { getProjectsForUser } from "./project.service";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: Date;
  assignedTaskCount: number;
  sharedProjectCount: number;
}

/**
 * The workspace has no separate "organization" table, so a user's team is
 * everyone who shares at least one project with them.
 */
export async function getTeamForUser(userId: string): Promise<TeamMember[]> {
  const projects = await getProjectsForUser(userId);
  const projectIds = projects.map((project) => project.id);

  if (projectIds.length === 0) {
    return [];
  }

  const memberships = await db
    .select({
      userId: projectMembers.userId,
      projectId: projectMembers.projectId,
    })
    .from(projectMembers)
    .where(inArray(projectMembers.projectId, projectIds));

  const sharedProjectCountByUser = new Map<string, number>();

  for (const membership of memberships) {
    sharedProjectCountByUser.set(
      membership.userId,
      (sharedProjectCountByUser.get(membership.userId) ?? 0) + 1,
    );
  }

  const memberIds = [...sharedProjectCountByUser.keys()];

  if (memberIds.length === 0) {
    return [];
  }

  const [memberUsers, taskCounts] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(inArray(users.id, memberIds)),

    db
      .select({
        assigneeId: tasks.assigneeId,
        count: sql<number>`count(*)::int`,
      })
      .from(tasks)
      .where(
        and(
          inArray(tasks.projectId, projectIds),
          isNotNull(tasks.assigneeId),
        ),
      )
      .groupBy(tasks.assigneeId),
  ]);

  const taskCountByUser = new Map(
    taskCounts.map((row) => [row.assigneeId, row.count]),
  );

  return memberUsers
    .map((member) => ({
      ...member,
      assignedTaskCount: taskCountByUser.get(member.id) ?? 0,
      sharedProjectCount:
        sharedProjectCountByUser.get(member.id) ?? 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
