import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { activities } from "@/lib/db/schema";
import type { Activity, NewActivity } from "@/lib/db/types";

export interface ActivityWithActor extends Activity {
  actor: { id: string; name: string; avatarUrl: string | null } | null;
}

export async function getActivityByProject(
  projectId: string,
): Promise<Activity[]> {
  return db
    .select()
    .from(activities)
    .where(eq(activities.projectId, projectId))
    .orderBy(desc(activities.createdAt));
}

export async function getActivityByUser(
  userId: string,
): Promise<Activity[]> {
  return db
    .select()
    .from(activities)
    .where(eq(activities.userId, userId))
    .orderBy(desc(activities.createdAt));
}

export async function getRecentActivityForProjects(
  projectIds: string[],
  limit = 10,
): Promise<ActivityWithActor[]> {
  if (projectIds.length === 0) {
    return [];
  }

  const rows = await db.query.activities.findMany({
    where: (activity, { inArray: withinProjects }) =>
      withinProjects(activity.projectId, projectIds),
    orderBy: (activity, { desc: descending }) => [
      descending(activity.createdAt),
    ],
    limit,
    with: {
      user: {
        columns: { id: true, name: true, avatarUrl: true },
      },
    },
  });

  return rows.map((row) => ({
    ...row,
    actor: row.user,
  }));
}

export async function createActivity(
  data: NewActivity,
): Promise<Activity> {
  const result = await db
    .insert(activities)
    .values(data)
    .returning();

  return result[0];
}

export async function deleteActivity(
  activityId: string,
): Promise<Activity | undefined> {
  const result = await db
    .delete(activities)
    .where(eq(activities.id, activityId))
    .returning();

  return result[0];
}