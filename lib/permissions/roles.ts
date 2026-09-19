export const ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
  VIEWER: "viewer",
} as const;

export type Role =
  (typeof ROLES)[keyof typeof ROLES];

export const ROLE_PERMISSIONS: Record<
  Role,
  string[]
> = {
  owner: [
    "workspace:read",
    "workspace:update",
    "workspace:delete",
    "project:create",
    "project:read",
    "project:update",
    "project:delete",
    "task:create",
    "task:read",
    "task:update",
    "task:delete",
    "member:invite",
    "member:remove",
  ],

  admin: [
    "workspace:read",
    "workspace:update",
    "project:create",
    "project:read",
    "project:update",
    "project:delete",
    "task:create",
    "task:read",
    "task:update",
    "task:delete",
    "member:invite",
    "member:remove",
  ],

  member: [
    "workspace:read",
    "project:create",
    "project:read",
    "project:update",
    "task:create",
    "task:read",
    "task:update",
  ],

  viewer: [
    "workspace:read",
    "project:read",
    "task:read",
  ],
};