import { describe, expect, it } from "vitest";

import {
  canCreateTask,
  canDeleteTask,
  canManageMembers,
  hasPermission,
} from "@/lib/permissions";
import { ROLES } from "@/lib/permissions/roles";

describe("role permissions", () => {
  it("gives the owner full task and member management rights", () => {
    expect(canCreateTask(ROLES.OWNER)).toBe(true);
    expect(canDeleteTask(ROLES.OWNER)).toBe(true);
    expect(canManageMembers(ROLES.OWNER)).toBe(true);
  });

  it("lets members create and update tasks but not delete them", () => {
    expect(canCreateTask(ROLES.MEMBER)).toBe(true);
    expect(hasPermission(ROLES.MEMBER, "task:update")).toBe(true);
    expect(canDeleteTask(ROLES.MEMBER)).toBe(false);
  });

  it("restricts viewers to read-only access", () => {
    expect(canCreateTask(ROLES.VIEWER)).toBe(false);
    expect(hasPermission(ROLES.VIEWER, "task:read")).toBe(true);
    expect(hasPermission(ROLES.VIEWER, "project:update")).toBe(false);
  });

  it("does not let members manage other members", () => {
    expect(canManageMembers(ROLES.MEMBER)).toBe(false);
    expect(canManageMembers(ROLES.ADMIN)).toBe(true);
  });
});
