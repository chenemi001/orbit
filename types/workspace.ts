import type { User } from "./auth";

export type WorkspaceRole =
  | "owner"
  | "admin"
  | "member"
  | "viewer";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  ownerId?: string;
  members?: WorkspaceMember[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  user: User;
  role: WorkspaceRole;
  joinedAt: string | Date;
}

export interface CreateWorkspaceInput {
  name: string;
  slug: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  slug?: string;
  image?: string | null;
}