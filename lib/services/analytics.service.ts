import { and, gte, inArray, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { activities, tasks } from "@/lib/db/schema";
import { getProjectsForUser } from "./project.service";

export interface WorkspaceAnalytics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
  priorityDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  projectProgress: { id: string; name: string; progress: number }[];
  activityByDay: { date: string; count: number }[];
}

export async function getWorkspaceAnalytics(
  userId: string,
): Promise<WorkspaceAnalytics> {
  const userProjects = await getProjectsForUser(userId);
  const projectIds = userProjects.map((project) => project.id);

  const empty: WorkspaceAnalytics = {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    priorityDistribution: {},
    statusDistribution: {},
    projectProgress: [],
    activityByDay: [],
  };

  if (projectIds.length === 0) {
    return empty;
  }

  const totalProjects = userProjects.length;
  const activeProjects = userProjects.filter(
    (project) => project.status === "active",
  ).length;
  const completedProjects = userProjects.filter(
    (project) => project.status === "completed",
  ).length;

  const projectTasks = await db
    .select({
      id: tasks.id,
      status: tasks.status,
      priority: tasks.priority,
      dueDate: tasks.dueDate,
    })
    .from(tasks)
    .where(inArray(tasks.projectId, projectIds));

  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(
    (task) => task.status === "completed",
  ).length;

  const now = new Date();
  const overdueTasks = projectTasks.filter(
    (task) =>
      task.dueDate &&
      task.dueDate < now &&
      task.status !== "completed",
  ).length;

  const priorityDistribution: Record<string, number> = {};
  const statusDistribution: Record<string, number> = {};

  for (const task of projectTasks) {
    priorityDistribution[task.priority] =
      (priorityDistribution[task.priority] ?? 0) + 1;
    statusDistribution[task.status] =
      (statusDistribution[task.status] ?? 0) + 1;
  }

  const projectProgress = userProjects.map((project) => ({
    id: project.id,
    name: project.name,
    progress: project.progress,
  }));

  const since = new Date(now);
  since.setDate(since.getDate() - 13);
  since.setHours(0, 0, 0, 0);

  const recentActivity = await db
    .select({
      day: sql<string>`to_char(${activities.createdAt}, 'YYYY-MM-DD')`,
      count: sql<number>`count(*)::int`,
    })
    .from(activities)
    .where(
      and(
        inArray(activities.projectId, projectIds),
        gte(activities.createdAt, since),
      ),
    )
    .groupBy(sql`to_char(${activities.createdAt}, 'YYYY-MM-DD')`);

  const countByDay = new Map(
    recentActivity.map((row) => [row.day, row.count]),
  );

  const activityByDay = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(since);
    date.setDate(date.getDate() + index);
    const key = date.toISOString().slice(0, 10);

    return { date: key, count: countByDay.get(key) ?? 0 };
  });

  return {
    totalProjects,
    activeProjects,
    completedProjects,
    totalTasks,
    completedTasks,
    overdueTasks,
    completionRate:
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
    priorityDistribution,
    statusDistribution,
    projectProgress,
    activityByDay,
  };
}
