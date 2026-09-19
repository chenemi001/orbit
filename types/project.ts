import type { User } from "./auth";

export type ProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "completed"
  | "archived";

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  status: ProjectStatus;
  progress: number;
  members?: User[];
  taskCount?: number;
  completedTaskCount?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  user: User;
  role: "owner" | "admin" | "member" | "viewer";
  joinedAt: string | Date;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}