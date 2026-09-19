import { requireUser } from "@/lib/auth";
import { created, errorResponse, success } from "@/lib/api/response";
import { parseJsonBody } from "@/lib/api/validate";
import { createConversationSchema } from "@/lib/validation/ai";
import {
  createAIConversation,
  getAIConversations,
} from "@/lib/services/ai.service";

export async function GET() {
  try {
    const user = await requireUser();
    const conversations = await getAIConversations(user.id);

    return success(conversations);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const data = await parseJsonBody(request, createConversationSchema);

    const conversation = await createAIConversation({
      userId: user.id,
      projectId: data.projectId,
      title: data.title,
    });

    return created(conversation);
  } catch (error) {
    return errorResponse(error);
  }
}
