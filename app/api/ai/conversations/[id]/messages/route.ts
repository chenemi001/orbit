import { requireUser } from "@/lib/auth";
import { created, errorResponse, success } from "@/lib/api/response";
import { parseJsonBody } from "@/lib/api/validate";
import { forbidden, notFound, serviceUnavailable } from "@/lib/api/errors";
import { createMessageSchema } from "@/lib/validation/ai";
import {
  createAIMessage,
  getAIConversationById,
  getAIMessages,
  updateAIConversation,
} from "@/lib/services/ai.service";
import { generateAIResponse } from "@/lib/ai/client";
import { AI_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { buildOrbitContext } from "@/lib/ai/context";

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function loadOwnedConversation(id: string, userId: string) {
  const conversation = await getAIConversationById(id);

  if (!conversation) {
    throw notFound("Conversation not found");
  }

  if (conversation.userId !== userId) {
    throw forbidden();
  }

  return conversation;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireUser();

    await loadOwnedConversation(id, user.id);

    const messages = await getAIMessages(id);

    return success(messages);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireUser();

    const conversation = await loadOwnedConversation(id, user.id);
    const data = await parseJsonBody(request, createMessageSchema);

    const userMessage = await createAIMessage({
      conversationId: id,
      role: "user",
      content: data.content,
    });

    if (!conversation.title) {
      await updateAIConversation(
        id,
        data.content.slice(0, 60) +
          (data.content.length > 60 ? "…" : ""),
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      throw serviceUnavailable(
        "The AI assistant isn't configured yet. Add an OPENAI_API_KEY to enable it.",
      );
    }

    const [context, history] = await Promise.all([
      buildOrbitContext(user.id, user.name),
      getAIMessages(id),
    ]);

    const completion = await generateAIResponse({
      messages: [
        {
          role: "system",
          content: `${AI_SYSTEM_PROMPT}\n\nWorkspace context:\n${context}`,
        },
        ...history.map((message) => ({
          role: message.role as "user" | "assistant",
          content: message.content,
        })),
      ],
    });

    const assistantMessage = await createAIMessage({
      conversationId: id,
      role: "assistant",
      content: completion.content,
    });

    return created({ userMessage, assistantMessage });
  } catch (error) {
    return errorResponse(error);
  }
}
