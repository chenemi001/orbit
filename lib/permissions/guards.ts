import { forbidden, notFound } from "@/lib/api/errors";
import { getUserProjectRole } from "@/lib/services/project-member.service";

import { hasPermission } from "./index";
import type { Role } from "./roles";

/**
 * Resolves the current user's role on a project. Throws NOT_FOUND (rather
 * than FORBIDDEN) when the user has no access, so a private project's
 * existence isn't leaked to users who aren't members of it.
 */
export async function requireProjectRole(
  projectId: string,
  userId: string,
): Promise<Role> {
  const role = await getUserProjectRole(projectId, userId);

  if (!role) {
    throw notFound("Project not found");
  }

  return role;
}

export async function requireProjectPermission(
  projectId: string,
  userId: string,
  permission: string,
): Promise<Role> {
  const role = await requireProjectRole(projectId, userId);

  if (!hasPermission(role, permission)) {
    throw forbidden();
  }

  return role;
}
