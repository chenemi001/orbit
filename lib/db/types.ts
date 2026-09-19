import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import {
  activities,
  aiConversations,
  aiMessages,
  notifications,
  projectMembers,
  projects,
  tasks,
  users,
} from "./schema";

/* ─────────────────────────────────────
   SELECT TYPES
───────────────────────────────────── */

export type User = InferSelectModel<typeof users>;

export type Project = InferSelectModel<typeof projects>;

export type ProjectMember = InferSelectModel<typeof projectMembers>;

export type Task = InferSelectModel<typeof tasks>;

export type Notification = InferSelectModel<typeof notifications>;

export type Activity = InferSelectModel<typeof activities>;

export type AIConversation = InferSelectModel<typeof aiConversations>;

export type AIMessage = InferSelectModel<typeof aiMessages>;

/* ─────────────────────────────────────
   INSERT TYPES
───────────────────────────────────── */

export type NewUser = InferInsertModel<typeof users>;

export type NewProject = InferInsertModel<typeof projects>;

export type NewProjectMember = InferInsertModel<typeof projectMembers>;

export type NewTask = InferInsertModel<typeof tasks>;

export type NewNotification = InferInsertModel<typeof notifications>;

export type NewActivity = InferInsertModel<typeof activities>;

export type NewAIConversation = InferInsertModel<typeof aiConversations>;

export type NewAIMessage = InferInsertModel<typeof aiMessages>;