import { requireUser } from "@/lib/auth";
import { errorResponse, success } from "@/lib/api/response";
import { requireProjectPermission } from "@/lib/permissions/guards";
import { getActivityByProject } from "@/lib/services/activity.service";
import { db } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireUser();

    await requireProjectPermission(id, user.id, "project:read");

    const activity = await getActivityByProject(id);

    const userIds = [...new Set(activity.map((entry) => entry.userId))];

    const actors = userIds.length
      ? await db.query.users.findMany({
          where: (u, { inArray }) => inArray(u.id, userIds),
          columns: { id: true, name: true, avatarUrl: true },
        })
      : [];

    const actorsById = new Map(actors.map((actor) => [actor.id, actor]));

    const withActors = activity.map((entry) => ({
      ...entry,
      actor: actorsById.get(entry.userId) ?? null,
    }));

    return success(withActors);
  } catch (error) {
    return errorResponse(error);
  }
}
