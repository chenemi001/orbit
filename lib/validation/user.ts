import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .optional(),

  avatarUrl: z
    .string()
    .trim()
    .url("Please enter a valid URL")
    .max(2000)
    .nullable()
    .optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Please enter your current password"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
