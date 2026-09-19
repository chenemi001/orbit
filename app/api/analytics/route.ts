import { requireUser } from "@/lib/auth";
import { errorResponse, success } from "@/lib/api/response";
import { getWorkspaceAnalytics } from "@/lib/services/analytics.service";

export async function GET() {
  try {
    const user = await requireUser();
    const analytics = await getWorkspaceAnalytics(user.id);

    return success(analytics);
  } catch (error) {
    return errorResponse(error);
  }
}
