import { requireUser } from "@/lib/auth";
import { errorResponse, success } from "@/lib/api/response";
import {
  getNotificationsByUser,
  getUnreadNotificationCount,
} from "@/lib/services/notification.service";

export async function GET() {
  try {
    const user = await requireUser();

    const [notifications, unreadCount] = await Promise.all([
      getNotificationsByUser(user.id),
      getUnreadNotificationCount(user.id),
    ]);

    return success({ notifications, unreadCount });
  } catch (error) {
    return errorResponse(error);
  }
}
