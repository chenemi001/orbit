import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "@/lib/validation/auth";
import { createTaskSchema, taskStatusSchema } from "@/lib/validation/task";
import { createProjectSchema } from "@/lib/validation/project";

describe("registerSchema", () => {
  it("accepts a valid registration payload", () => {
    const result = registerSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "computingpioneer",
      confirmPassword: "computingpioneer",
    });

    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "computingpioneer",
      confirmPassword: "somethingelse",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      password: "short",
      confirmPassword: "short",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result = registerSchema.safeParse({
      name: "Ada",
      email: "not-an-email",
      password: "computingpioneer",
      confirmPassword: "computingpioneer",
    });

    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires a non-empty password", () => {
    const result = loginSchema.safeParse({
      email: "ada@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("taskStatusSchema", () => {
  it("matches the database enum exactly", () => {
    for (const status of ["todo", "in_progress", "in_review", "completed"]) {
      expect(taskStatusSchema.safeParse(status).success).toBe(true);
    }
  });

  it("rejects statuses from an earlier design iteration", () => {
    for (const status of ["in-progress", "review", "done"]) {
      expect(taskStatusSchema.safeParse(status).success).toBe(false);
    }
  });
});

describe("createTaskSchema", () => {
  it("requires a projectId and title", () => {
    const result = createTaskSchema.safeParse({
      title: "",
      projectId: "not-a-uuid",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a minimal valid task", () => {
    const result = createTaskSchema.safeParse({
      title: "Ship the release",
      projectId: "123e4567-e89b-12d3-a456-426614174000",
    });

    expect(result.success).toBe(true);
  });
});

describe("createProjectSchema", () => {
  it("rejects a one-character name", () => {
    expect(
      createProjectSchema.safeParse({ name: "X" }).success,
    ).toBe(false);
  });

  it("accepts a valid project name without a description", () => {
    expect(
      createProjectSchema.safeParse({ name: "Website redesign" }).success,
    ).toBe(true);
  });
});
