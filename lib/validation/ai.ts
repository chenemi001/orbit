import { z } from "zod";

export const createConversationSchema = z.object({
  projectId: z.string().uuid("Invalid project ID").optional(),
  title: z.string().trim().max(200).optional(),
});

export const createMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(4000, "Message is too long"),
});

export type CreateConversationInput = z.infer<
  typeof createConversationSchema
>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
