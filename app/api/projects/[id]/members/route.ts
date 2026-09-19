import { requireUser } from "@/lib/auth";
import { created, errorResponse, success } from "@/lib/api/response";
import { parseJsonBody } from "@/lib/api/validate";
import { conflict, notFound } from "@/lib/api/errors";
import { addProjectMemberSchema } from "@/lib/validation/project-member";
import { requireProjectPermission } from "@/lib/permissions/guards";
import {
  addProjectMember,
  getProjectMembers,
  getUserProjectMembership,
} from "@/lib/services/project-member.service";
import { getUserByEmail } from "@/lib/services/user.service";
import { getProjectById } from "@/lib/services/project.service";
import { createActivity } from "@/lib/services/activity.service";
import { createNotification } from "@/lib/services/notification.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireUser();

    await requireProjectPermission(id, user.id, "project:read");

    const members = await getProjectMembers(id);

    return success(members);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireUser();

    await requireProjectPermission(id, user.id, "member:invite");

    const project = await getProjectById(id);

    if (!project) {
      throw notFound("Project not found");
    }

    const data = await parseJsonBody(request, addProjectMemberSchema);

    const invitee = await getUserByEmail(data.email.toLowerCase().trim());

    if (!invitee) {
      throw notFound(
        "No Orbit account exists with that email address",
      );
    }

    const existingMembership = await getUserProjectMembership(
      id,
      invitee.id,
    );

    if (existingMembership) {
      throw conflict("This person is already a member of the project");
    }

    const member = await addProjectMember({
      projectId: id,
      userId: invitee.id,
      role: data.role,
    });

    await createActivity({
      userId: user.id,
      projectId: id,
      taskId: null,
      action: "member_added",
      description: `${user.name} added ${invitee.name} to "${project.name}"`,
    });

    await createNotification({
      userId: invitee.id,
      type: "project_update",
      title: "Added to a project",
      message: `${user.name} added you to "${project.name}"`,
    });

    return created({
      ...member,
      user: {
        id: invitee.id,
        name: invitee.name,
        email: invitee.email,
        avatarUrl: invitee.avatarUrl,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
