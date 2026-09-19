import { requireUser } from "@/lib/auth";
import { errorResponse, noContent } from "@/lib/api/response";
import { badRequest, notFound } from "@/lib/api/errors";
import { requireProjectPermission } from "@/lib/permissions/guards";
import {
  getUserProjectMembership,
  removeProjectMember,
} from "@/lib/services/project-member.service";
import { getProjectById } from "@/lib/services/project.service";
import { createActivity } from "@/lib/services/activity.service";

interface RouteParams {
  params: Promise<{ id: string; userId: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id, userId } = await params;
    const user = await requireUser();

    await requireProjectPermission(id, user.id, "member:remove");

    const project = await getProjectById(id);

    if (!project) {
      throw notFound("Project not found");
    }

    if (userId === project.ownerId) {
      throw badRequest("The project owner cannot be removed");
    }

    const membership = await getUserProjectMembership(id, userId);

    if (!membership) {
      throw notFound("This person is not a member of the project");
    }

    await removeProjectMember(id, userId);

    await createActivity({
      userId: user.id,
      projectId: id,
      taskId: null,
      action: "member_removed",
      description: `${user.name} removed a member from "${project.name}"`,
    });

    return noContent();
  } catch (error) {
    return errorResponse(error);
  }
}
