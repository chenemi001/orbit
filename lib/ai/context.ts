import { getTasksByAssignee } from "@/lib/services/task.service";
import { getProjectsForUser } from "@/lib/services/project.service";

/**
 * Summarizes the user's real Orbit data (tasks, projects, deadlines) as
 * plain text so the assistant can answer workspace-specific questions
 * instead of talking in generic terms.
 */
export async function buildOrbitContext(
  userId: string,
  userName: string,
): Promise<string> {
  const [myTasks, projects] = await Promise.all([
    getTasksByAssignee(userId),
    getProjectsForUser(userId),
  ]);

  const now = new Date();

  const overdue = myTasks.filter(
    (task) =>
      task.dueDate && task.dueDate < now && task.status !== "completed",
  );

  const open = myTasks.filter((task) => task.status !== "completed");

  const projectById = new Map(projects.map((project) => [project.id, project]));

  const taskLines = open
    .slice(0, 30)
    .map((task) => {
      const project = projectById.get(task.projectId);
      const due = task.dueDate
        ? new Date(task.dueDate).toISOString().slice(0, 10)
        : "no due date";

      return `- "${task.title}" [${task.status}, ${task.priority} priority, due ${due}]${
        project ? ` in project "${project.name}"` : ""
      }`;
    })
    .join("\n");

  const projectLines = projects
    .map(
      (project) =>
        `- "${project.name}" [${project.status}, ${project.progress}% complete]`,
    )
    .join("\n");

  return `
Current user: ${userName}

Their open tasks (${open.length} total, ${overdue.length} overdue):
${taskLines || "None."}

Their projects (${projects.length} total):
${projectLines || "None."}

Today's date: ${now.toISOString().slice(0, 10)}
`.trim();
}
