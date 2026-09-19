import { z } from "zod";

export const taskStatusSchema = z.enum([
  "todo",
  "in_progress",
  "in_review",
  "completed",
]);

export const taskPrioritySchema = z.enum([
  "low",
  "medium",
  "high",
  "urgent",
]);

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(200, "Task title is too long"),

  description: z
    .string()
    .trim()
    .max(2000, "Description is too long")
    .optional(),

  status: taskStatusSchema.default("todo"),

  priority: taskPrioritySchema.default(
    "medium"
  ),

  projectId: z
    .string()
    .uuid("Invalid project ID"),

  assigneeId: z
    .string()
    .uuid("Invalid assignee ID")
    .optional(),

  dueDate: z
    .string()
    .datetime()
    .optional(),
});

export const createTaskSchema =
  taskSchema.pick({
    title: true,
    description: true,
    status: true,
    priority: true,
    projectId: true,
    assigneeId: true,
    dueDate: true,
  });

export const updateTaskSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .optional(),

    description: z
      .string()
      .trim()
      .max(2000)
      .optional(),

    status: taskStatusSchema.optional(),

    priority:
      taskPrioritySchema.optional(),

    assigneeId: z
      .string()
      .uuid()
      .nullable()
      .optional(),

    dueDate: z
      .string()
      .datetime()
      .nullable()
      .optional(),
  });

export type TaskInput = z.infer<
  typeof taskSchema
>;

export type CreateTaskInput = z.infer<
  typeof createTaskSchema
>;

export type UpdateTaskInput = z.infer<
  typeof updateTaskSchema
>;