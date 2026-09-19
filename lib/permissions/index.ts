import {
  ROLE_PERMISSIONS,
  Role,
} from "./roles";

export function hasPermission(
  role: Role,
  permission: string
) {
  return (
    ROLE_PERMISSIONS[role]?.includes(
      permission
    ) ?? false
  );
}

export function hasAnyPermission(
  role: Role,
  permissions: string[]
) {
  return permissions.some((permission) =>
    hasPermission(role, permission)
  );
}

export function hasAllPermissions(
  role: Role,
  permissions: string[]
) {
  return permissions.every((permission) =>
    hasPermission(role, permission)
  );
}

export function canCreateTask(role: Role) {
  return hasPermission(
    role,
    "task:create"
  );
}

export function canUpdateTask(role: Role) {
  return hasPermission(
    role,
    "task:update"
  );
}

export function canDeleteTask(role: Role) {
  return hasPermission(
    role,
    "task:delete"
  );
}

export function canManageMembers(
  role: Role
) {
  return hasAnyPermission(role, [
    "member:invite",
    "member:remove",
  ]);
}