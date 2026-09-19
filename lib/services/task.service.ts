import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import type { NewTask, Task } from "@/lib/db/types";

export async function getTaskById(
  taskId: string,
): Promise<Task | undefined> {
  const result = await db
    .select()
    .from(tasks)
    .where(eq(tasks.id, taskId))
    .limit(1);

  return result[0];
}

export async function getTasksByProject(
  projectId: string,
): Promise<Task[]> {
  return db
    .select()
    .from(tasks)
    .where(eq(tasks.projectId, projectId));
}

export async function getTasksByAssignee(
  assigneeId: string,
): Promise<Task[]> {
  return db
    .select()
    .from(tasks)
    .where(eq(tasks.assigneeId, assigneeId));
}

export async function getProjectTaskById(
  projectId: string,
  taskId: string,
): Promise<Task | undefined> {
  const result = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.id, taskId),
        eq(tasks.projectId, projectId),
      ),
    )
    .limit(1);

  return result[0];
}

export async function createTask(
  data: NewTask,
): Promise<Task> {
  const result = await db
    .insert(tasks)
    .values(data)
    .returning();

  return result[0];
}

export async function updateTask(
  taskId: string,
  data: Partial<NewTask>,
): Promise<Task | undefined> {
  const result = await db
    .update(tasks)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId))
    .returning();

  return result[0];
}

export async function deleteTask(
  taskId: string,
): Promise<Task | undefined> {
  const result = await db
    .delete(tasks)
    .where(eq(tasks.id, taskId))
    .returning();

  return result[0];
}