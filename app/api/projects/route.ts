import { requireUser } from "@/lib/auth";
import { created, errorResponse, success } from "@/lib/api/response";
import { parseJsonBody } from "@/lib/api/validate";
import { createProjectSchema } from "@/lib/validation/project";
import {
  createProjectWithOwner,
  getProjectsForUser,
  getProjectTaskStats,
} from "@/lib/services/project.service";
import { createActivity } from "@/lib/services/activity.service";

export async function GET() {
  try {
    const user = await requireUser();
    const projects = await getProjectsForUser(user.id);

    const withStats = await Promise.all(
      projects.map(async (project) => ({
        ...project,
        stats: await getProjectTaskStats(project.id),
      })),
    );

    return success(withStats);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const data = await parseJsonBody(request, createProjectSchema);

    const project = await createProjectWithOwner({
      name: data.name,
      description: data.description,
      ownerId: user.id,
    });

    await createActivity({
      userId: user.id,
      projectId: project.id,
      taskId: null,
      action: "project_created",
      description: `${user.name} created the project "${project.name}"`,
    });

    return created(project);
  } catch (error) {
    return errorResponse(error);
  }
}
