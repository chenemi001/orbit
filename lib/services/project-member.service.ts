import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { projectMembers, projects, users } from "@/lib/db/schema";
import type {
  NewProjectMember,
  ProjectMember,
} from "@/lib/db/types";
import type { Role } from "@/lib/permissions/roles";

export interface ProjectMemberWithUser extends ProjectMember {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

export async function getProjectMembers(
  projectId: string,
): Promise<ProjectMemberWithUser[]> {
  const rows = await db
    .select({
      id: projectMembers.id,
      projectId: projectMembers.projectId,
      userId: projectMembers.userId,
      role: projectMembers.role,
      createdAt: projectMembers.createdAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(projectMembers)
    .innerJoin(users, eq(projectMembers.userId, users.id))
    .where(eq(projectMembers.projectId, projectId));

  return rows;
}

export async function getUserProjectMembership(
  projectId: string,
  userId: string,
): Promise<ProjectMember | undefined> {
  const result = await db
    .select()
    .from(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId),
      ),
    )
    .limit(1);

  return result[0];
}

/**
 * Resolves a user's effective role on a project. Falls back to "owner"
 * when the user owns the project even if a membership row is missing,
 * since project creation always inserts the owner as a member.
 */
export async function getUserProjectRole(
  projectId: string,
  userId: string,
): Promise<Role | null> {
  const membership = await getUserProjectMembership(projectId, userId);

  if (membership) {
    return membership.role as Role;
  }

  const project = await db
    .select({ ownerId: projects.ownerId })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (project[0]?.ownerId === userId) {
    return "owner";
  }

  return null;
}

export async function addProjectMember(
  data: NewProjectMember,
): Promise<ProjectMember> {
  const result = await db
    .insert(projectMembers)
    .values(data)
    .returning();

  return result[0];
}

export async function removeProjectMember(
  projectId: string,
  userId: string,
): Promise<ProjectMember | undefined> {
  const result = await db
    .delete(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId),
      ),
    )
    .returning();

  return result[0];
}
