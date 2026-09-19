import { getProjectsForUser } from "./project.service";
import { getTasksByAssignee } from "./task.service";
import { getRecentActivityForProjects } from "./activity.service";

export interface DashboardTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: Date | null;
  projectId: string;
  projectName: string;
}

export interface DashboardData {
  stats: {
    activeProjects: number;
    openTasks: number;
    completedTasks: number;
    overdueTasks: number;
  };
  myTasks: DashboardTask[];
  projects: Awaited<ReturnType<typeof getProjectsForUser>>;
  activity: Awaited<ReturnType<typeof getRecentActivityForProjects>>;
  health: {
    onTrack: number;
    atRisk: number;
    delayed: number;
    completed: number;
  };
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const [projects, assignedTasks] = await Promise.all([
    getProjectsForUser(userId),
    getTasksByAssignee(userId),
  ]);

  const now = new Date();

  const openTasks = assignedTasks.filter(
    (task) => task.status !== "completed",
  );
  const completedTasks = assignedTasks.filter(
    (task) => task.status === "completed",
  );
  const overdueTasks = openTasks.filter(
    (task) => task.dueDate && task.dueDate < now,
  );

  const activeProjects = projects.filter(
    (project) => project.status === "active",
  );

  const health = { onTrack: 0, atRisk: 0, delayed: 0, completed: 0 };

  for (const project of projects) {
    if (project.status === "completed" || project.status === "archived") {
      health.completed += 1;
    } else if (project.progress >= 70) {
      health.onTrack += 1;
    } else if (project.progress >= 35) {
      health.atRisk += 1;
    } else {
      health.delayed += 1;
    }
  }

  const activity = await getRecentActivityForProjects(
    projects.map((project) => project.id),
    8,
  );

  const projectNameById = new Map(
    projects.map((project) => [project.id, project.name]),
  );

  const myTasks: DashboardTask[] = openTasks
    .slice()
    .sort((a, b) => {
      const aDue = a.dueDate?.getTime() ?? Infinity;
      const bDue = b.dueDate?.getTime() ?? Infinity;
      return aDue - bDue;
    })
    .slice(0, 6)
    .map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      projectId: task.projectId,
      projectName: projectNameById.get(task.projectId) ?? "Unknown project",
    }));

  return {
    stats: {
      activeProjects: activeProjects.length,
      openTasks: openTasks.length,
      completedTasks: completedTasks.length,
      overdueTasks: overdueTasks.length,
    },
    myTasks,
    projects: projects
      .slice()
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 4),
    activity,
    health,
  };
}
