import { z } from "zod";

import { requireUser } from "@/lib/auth";
import { errorResponse, noContent, success } from "@/lib/api/response";
import { parseJsonBody } from "@/lib/api/validate";
import { notFound } from "@/lib/api/errors";
import { updateProjectSchema } from "@/lib/validation/project";
import { requireProjectPermission } from "@/lib/permissions/guards";
import {
  deleteProject,
  getProjectById,
  getProjectTaskStats,
  updateProject,
} from "@/lib/services/project.service";
import { getProjectMembers } from "@/lib/services/project-member.service";
import { createActivity } from "@/lib/services/activity.service";

const patchSchema = updateProjectSchema.extend({
  status: z
    .enum(["planning", "active", "on_hold", "completed", "archived"])
    .optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireUser();

    await requireProjectPermission(id, user.id, "project:read");

    const project = await getProjectById(id);

    if (!project) {
      throw notFound("Project not found");
    }

    const [members, stats] = await Promise.all([
      getProjectMembers(id),
      getProjectTaskStats(id),
    ]);

    return success({ ...project, members, stats });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireUser();

    await requireProjectPermission(id, user.id, "project:update");

    const existing = await getProjectById(id);

    if (!existing) {
      throw notFound("Project not found");
    }

    const data = await parseJsonBody(request, patchSchema);

    const updated = await updateProject(id, data);

    if (!updated) {
      throw notFound("Project not found");
    }

    if (data.status && data.status !== existing.status) {
      await createActivity({
        userId: user.id,
        projectId: id,
        taskId: null,
        action:
          data.status === "completed"
            ? "project_completed"
            : "project_status_changed",
        description:
          data.status === "completed"
            ? `${user.name} marked "${updated.name}" as completed`
            : `${user.name} changed "${updated.name}" status to ${data.status.replace("_", " ")}`,
      });
    } else {
      await createActivity({
        userId: user.id,
        projectId: id,
        taskId: null,
        action: "project_updated",
        description: `${user.name} updated the project "${updated.name}"`,
      });
    }

    return success(updated);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireUser();

    await requireProjectPermission(id, user.id, "project:delete");

    const existing = await getProjectById(id);

    if (!existing) {
      throw notFound("Project not found");
    }

    await deleteProject(id);

    return noContent();
  } catch (error) {
    return errorResponse(error);
  }
}
