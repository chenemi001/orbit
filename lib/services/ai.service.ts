import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  aiConversations,
  aiMessages,
} from "@/lib/db/schema";
import type {
  AIConversation,
  AIMessage,
  NewAIConversation,
  NewAIMessage,
} from "@/lib/db/types";

/* ─────────────────────────────────────
   CONVERSATIONS
───────────────────────────────────── */

export async function getAIConversations(
  userId: string,
): Promise<AIConversation[]> {
  return db
    .select()
    .from(aiConversations)
    .where(eq(aiConversations.userId, userId))
    .orderBy(desc(aiConversations.updatedAt));
}

export async function getAIConversationById(
  conversationId: string,
): Promise<AIConversation | undefined> {
  const result = await db
    .select()
    .from(aiConversations)
    .where(eq(aiConversations.id, conversationId))
    .limit(1);

  return result[0];
}

export async function createAIConversation(
  data: NewAIConversation,
): Promise<AIConversation> {
  const result = await db
    .insert(aiConversations)
    .values(data)
    .returning();

  return result[0];
}

export async function deleteAIConversation(
  conversationId: string,
): Promise<AIConversation | undefined> {
  const result = await db
    .delete(aiConversations)
    .where(eq(aiConversations.id, conversationId))
    .returning();

  return result[0];
}

export async function updateAIConversation(
  conversationId: string,
  title: string,
): Promise<AIConversation | undefined> {
  const result = await db
    .update(aiConversations)
    .set({
      title,
      updatedAt: new Date(),
    })
    .where(eq(aiConversations.id, conversationId))
    .returning();

  return result[0];
}

/* ─────────────────────────────────────
   MESSAGES
───────────────────────────────────── */

export async function getAIMessages(
  conversationId: string,
): Promise<AIMessage[]> {
  return db
    .select()
    .from(aiMessages)
    .where(eq(aiMessages.conversationId, conversationId))
    .orderBy(aiMessages.createdAt);
}

export async function createAIMessage(
  data: NewAIMessage,
): Promise<AIMessage> {
  const result = await db
    .insert(aiMessages)
    .values(data)
    .returning();

  return result[0];
}