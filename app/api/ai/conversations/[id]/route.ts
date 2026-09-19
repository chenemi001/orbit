import { requireUser } from "@/lib/auth";
import { errorResponse, noContent } from "@/lib/api/response";
import { forbidden, notFound } from "@/lib/api/errors";
import {
  deleteAIConversation,
  getAIConversationById,
} from "@/lib/services/ai.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireUser();

    const conversation = await getAIConversationById(id);

    if (!conversation) {
      throw notFound("Conversation not found");
    }

    if (conversation.userId !== user.id) {
      throw forbidden();
    }

    await deleteAIConversation(id);

    return noContent();
  } catch (error) {
    return errorResponse(error);
  }
}
