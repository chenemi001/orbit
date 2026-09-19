import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { projectMembers, projects, tasks } from "@/lib/db/schema";
import type { NewProject, Project } from "@/lib/db/types";

export async function getProjectById(
  projectId: string,
): Promise<Project | undefined> {
  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  return result[0];
}

export async function getProjectsByOwner(
  ownerId: string,
): Promise<Project[]> {
  return db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, ownerId));
}

/**
 * Every project member row (including the owner, who is always added as a
 * member at creation time) grants access, so this is the single source of
 * truth for "which projects can this user see".
 */
export async function getProjectsForUser(
  userId: string,
): Promise<Project[]> {
  const rows = await db
    .select({ project: projects })
    .from(projectMembers)
    .innerJoin(projects, eq(projectMembers.projectId, projects.id))
    .where(eq(projectMembers.userId, userId))
    .orderBy(desc(projects.updatedAt));

  return rows.map((row) => row.project);
}

export async function createProject(
  data: NewProject,
): Promise<Project> {
  const result = await db
    .insert(projects)
    .values(data)
    .returning();

  return result[0];
}

/**
 * Creates a project and atomically adds its owner as an "owner" member, so
 * every project always has a membership row for its creator.
 */
export async function createProjectWithOwner(data: {
  name: string;
  description?: string;
  ownerId: string;
}): Promise<Project> {
  return db.transaction(async (tx) => {
    const [project] = await tx
      .insert(projects)
      .values({
        name: data.name,
        description: data.description,
        ownerId: data.ownerId,
      })
      .returning();

    await tx.insert(projectMembers).values({
      projectId: project.id,
      userId: data.ownerId,
      role: "owner",
    });

    return project;
  });
}

export async function updateProject(
  projectId: string,
  data: Partial<NewProject>,
): Promise<Project | undefined> {
  const result = await db
    .update(projects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, projectId))
    .returning();

  return result[0];
}

export async function deleteProject(
  projectId: string,
): Promise<Project | undefined> {
  const result = await db
    .delete(projects)
    .where(eq(projects.id, projectId))
    .returning();

  return result[0];
}

/**
 * Recomputes a project's progress from its tasks' completion state and
 * persists it, so `projects.progress` never drifts into a fabricated value.
 */
export async function recalculateProjectProgress(
  projectId: string,
): Promise<number> {
  const projectTasks = await db
    .select({ status: tasks.status })
    .from(tasks)
    .where(eq(tasks.projectId, projectId));

  const total = projectTasks.length;
  const completed = projectTasks.filter(
    (task) => task.status === "completed",
  ).length;

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  await db
    .update(projects)
    .set({ progress, updatedAt: new Date() })
    .where(eq(projects.id, projectId));

  return progress;
}

export async function getProjectTaskStats(projectId: string) {
  const projectTasks = await db
    .select({ status: tasks.status })
    .from(tasks)
    .where(eq(tasks.projectId, projectId));

  const total = projectTasks.length;
  const completed = projectTasks.filter(
    (task) => task.status === "completed",
  ).length;

  return { total, completed };
}
