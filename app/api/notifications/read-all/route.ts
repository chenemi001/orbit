import { requireUser } from "@/lib/auth";
import { errorResponse, success } from "@/lib/api/response";
import { markAllNotificationsAsRead } from "@/lib/services/notification.service";

export async function POST() {
  try {
    const user = await requireUser();

    await markAllNotificationsAsRead(user.id);

    return success({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
