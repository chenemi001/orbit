import { requireUser } from "@/lib/auth";
import { errorResponse, success } from "@/lib/api/response";
import { getTeamForUser } from "@/lib/services/team.service";

export async function GET() {
  try {
    const user = await requireUser();
    const team = await getTeamForUser(user.id);

    return success(team);
  } catch (error) {
    return errorResponse(error);
  }
}
