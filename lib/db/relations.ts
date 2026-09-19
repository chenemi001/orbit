import { relations } from "drizzle-orm";

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
   USERS
───────────────────────────────────── */

export const usersRelations = relations(users, ({ many }) => ({
  ownedProjects: many(projects),
  projectMemberships: many(projectMembers),
  assignedTasks: many(tasks),
  notifications: many(notifications),
  activities: many(activities),
  aiConversations: many(aiConversations),
}));

/* ─────────────────────────────────────
   PROJECTS
───────────────────────────────────── */

export const projectsRelations = relations(
  projects,
  ({ one, many }) => ({
    owner: one(users, {
      fields: [projects.ownerId],
      references: [users.id],
    }),

    members: many(projectMembers),

    tasks: many(tasks),

    activities: many(activities),

    aiConversations: many(aiConversations),
  }),
);

/* ─────────────────────────────────────
   PROJECT MEMBERS
───────────────────────────────────── */

export const projectMembersRelations = relations(
  projectMembers,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectMembers.projectId],
      references: [projects.id],
    }),

    user: one(users, {
      fields: [projectMembers.userId],
      references: [users.id],
    }),
  }),
);

/* ─────────────────────────────────────
   TASKS
───────────────────────────────────── */

export const tasksRelations = relations(
  tasks,
  ({ one, many }) => ({
    project: one(projects, {
      fields: [tasks.projectId],
      references: [projects.id],
    }),

    assignee: one(users, {
      fields: [tasks.assigneeId],
      references: [users.id],
    }),

    activities: many(activities),
  }),
);

/* ─────────────────────────────────────
   NOTIFICATIONS
───────────────────────────────────── */

export const notificationsRelations = relations(
  notifications,
  ({ one }) => ({
    user: one(users, {
      fields: [notifications.userId],
      references: [users.id],
    }),
  }),
);

/* ─────────────────────────────────────
   ACTIVITIES
───────────────────────────────────── */

export const activitiesRelations = relations(
  activities,
  ({ one }) => ({
    user: one(users, {
      fields: [activities.userId],
      references: [users.id],
    }),

    project: one(projects, {
      fields: [activities.projectId],
      references: [projects.id],
    }),

    task: one(tasks, {
      fields: [activities.taskId],
      references: [tasks.id],
    }),
  }),
);

/* ─────────────────────────────────────
   AI CONVERSATIONS
───────────────────────────────────── */

export const aiConversationsRelations = relations(
  aiConversations,
  ({ one, many }) => ({
    user: one(users, {
      fields: [aiConversations.userId],
      references: [users.id],
    }),

    project: one(projects, {
      fields: [aiConversations.projectId],
      references: [projects.id],
    }),

    messages: many(aiMessages),
  }),
);

/* ─────────────────────────────────────
   AI MESSAGES
───────────────────────────────────── */

export const aiMessagesRelations = relations(
  aiMessages,
  ({ one }) => ({
    conversation: one(aiConversations, {
      fields: [aiMessages.conversationId],
      references: [aiConversations.id],
    }),
  }),
);