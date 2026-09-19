import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

/* ─────────────────────────────────────
   ENUMS
───────────────────────────────────── */

export const projectStatusEnum = pgEnum("project_status", [
  "planning",
  "active",
  "on_hold",
  "completed",
  "archived",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "in_review",
  "completed",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "task_assigned",
  "task_completed",
  "project_update",
  "mention",
  "system",
]);

export const memberRoleEnum = pgEnum("member_role", [
  "owner",
  "admin",
  "member",
  "viewer",
]);

/* ─────────────────────────────────────
   USERS
───────────────────────────────────── */

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  email: text("email").notNull().unique(),

  passwordHash: text("password_hash").notNull(),

  avatarUrl: text("avatar_url"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

/* ─────────────────────────────────────
   PROJECTS
───────────────────────────────────── */

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),

    description: text("description"),

    status: projectStatusEnum("status")
      .default("planning")
      .notNull(),

    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    progress: integer("progress").default(0).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("projects_owner_id_idx").on(table.ownerId)],
);

/* ─────────────────────────────────────
   PROJECT MEMBERS
───────────────────────────────────── */

export const projectMembers = pgTable(
  "project_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    role: memberRoleEnum("role").default("member").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("project_members_project_user_unique").on(
      table.projectId,
      table.userId,
    ),
    index("project_members_user_id_idx").on(table.userId),
  ],
);

/* ─────────────────────────────────────
   TASKS
───────────────────────────────────── */

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),

    title: text("title").notNull(),

    description: text("description"),

    status: taskStatusEnum("status")
      .default("todo")
      .notNull(),

    priority: taskPriorityEnum("priority")
      .default("medium")
      .notNull(),

    assigneeId: uuid("assignee_id").references(() => users.id, {
      onDelete: "set null",
    }),

    dueDate: timestamp("due_date", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("tasks_project_id_idx").on(table.projectId),
    index("tasks_assignee_id_idx").on(table.assigneeId),
  ],
);

/* ─────────────────────────────────────
   NOTIFICATIONS
───────────────────────────────────── */

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    type: notificationTypeEnum("type")
      .default("system")
      .notNull(),

    title: text("title").notNull(),

    message: text("message").notNull(),

    read: boolean("read").default(false).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("notifications_user_id_read_idx").on(table.userId, table.read),
  ],
);

/* ─────────────────────────────────────
   ACTIVITY
───────────────────────────────────── */

export const activities = pgTable(
  "activities",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),

    taskId: uuid("task_id").references(() => tasks.id, {
      onDelete: "cascade",
    }),

    action: text("action").notNull(),

    description: text("description").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("activities_project_id_idx").on(table.projectId),
    index("activities_user_id_idx").on(table.userId),
  ],
);

/* ─────────────────────────────────────
   AI CONVERSATIONS
───────────────────────────────────── */

export const aiConversations = pgTable(
  "ai_conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),

    title: text("title"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("ai_conversations_user_id_idx").on(table.userId)],
);

/* ─────────────────────────────────────
   AI MESSAGES
───────────────────────────────────── */

export const aiMessages = pgTable(
  "ai_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => aiConversations.id, {
        onDelete: "cascade",
      }),

    role: text("role").notNull(),

    content: text("content").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("ai_messages_conversation_id_idx").on(table.conversationId),
  ],
);