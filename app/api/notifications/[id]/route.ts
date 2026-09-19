import { requireUser } from "@/lib/auth";
import { errorResponse, success } from "@/lib/api/response";
import { notFound } from "@/lib/api/errors";
import { markNotificationAsRead } from "@/lib/services/notification.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireUser();

    const notification = await markNotificationAsRead(id, user.id);

    if (!notification) {
      throw notFound("Notification not found");
    }

    return success(notification);
  } catch (error) {
    return errorResponse(error);
  }
}
