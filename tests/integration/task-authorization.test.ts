import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { registerUser } from "@/lib/services/auth.service";
import {
  createProjectWithOwner,
  getProjectTaskStats,
  recalculateProjectProgress,
} from "@/lib/services/project.service";
import { getUserProjectRole } from "@/lib/services/project-member.service";
import { createTask, updateTask } from "@/lib/services/task.service";
import { eq } from "drizzle-orm";

/**
 * These tests exercise the real service layer against the configured
 * database (see tests/setup.ts). They create their own users/projects and
 * delete them afterward — nothing here should be left behind.
 */

const runId = Date.now();
const ownerEmail = `test-owner-${runId}@example.test`;
const outsiderEmail = `test-outsider-${runId}@example.test`;

let ownerId: string;
let outsiderId: string;
let projectId: string;

beforeAll(async () => {
  const owner = await registerUser("Test Owner", ownerEmail, "password123");
  const outsider = await registerUser(
    "Test Outsider",
    outsiderEmail,
    "password123",
  );

  ownerId = owner.id;
  outsiderId = outsider.id;

  const project = await createProjectWithOwner({
    name: `Integration Test Project ${runId}`,
    ownerId,
  });

  projectId = project.id;
});

afterAll(async () => {
  await db.delete(users).where(eq(users.id, ownerId));
  await db.delete(users).where(eq(users.id, outsiderId));
});

describe("project membership and access control", () => {
  it("automatically makes the creator an owner-role member", async () => {
    const role = await getUserProjectRole(projectId, ownerId);
    expect(role).toBe("owner");
  });

  it("gives a user with no membership row no role at all", async () => {
    const role = await getUserProjectRole(projectId, outsiderId);
    expect(role).toBeNull();
  });
});

describe("task lifecycle", () => {
  it("creates a task and reflects it in project stats", async () => {
    const task = await createTask({
      projectId,
      title: "Write integration tests",
      priority: "high",
    });

    expect(task.status).toBe("todo");

    const stats = await getProjectTaskStats(projectId);
    expect(stats.total).toBe(1);
    expect(stats.completed).toBe(0);

    const progress = await recalculateProjectProgress(projectId);
    expect(progress).toBe(0);

    const completed = await updateTask(task.id, { status: "completed" });
    expect(completed?.status).toBe("completed");

    const statsAfter = await getProjectTaskStats(projectId);
    expect(statsAfter.completed).toBe(1);

    const progressAfter = await recalculateProjectProgress(projectId);
    expect(progressAfter).toBe(100);
  });
});
