import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name is too long"),

  description: z
    .string()
    .trim()
    .max(1000, "Description is too long")
    .optional(),

  ownerId: z
    .string()
    .uuid("Invalid owner ID"),
});

export const createProjectSchema =
  projectSchema.pick({
    name: true,
    description: true,
  });

export const updateProjectSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    description: z
      .string()
      .trim()
      .max(1000)
      .optional(),
  });

export type ProjectInput = z.infer<
  typeof projectSchema
>;

export type CreateProjectInput = z.infer<
  typeof createProjectSchema
>;

export type UpdateProjectInput = z.infer<
  typeof updateProjectSchema
>;