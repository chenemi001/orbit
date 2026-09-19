import { z } from "zod";

export const memberRoleSchema = z.enum([
  "owner",
  "admin",
  "member",
  "viewer",
]);

export const addProjectMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  role: memberRoleSchema.default("member"),
});

export const updateProjectMemberSchema = z.object({
  role: memberRoleSchema,
});

export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>;
export type UpdateProjectMemberInput = z.infer<
  typeof updateProjectMemberSchema
>;
