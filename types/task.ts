export type TaskStatus =
  | "todo"
  | "in_progress"
  | "in_review"
  | "completed";

export type TaskPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export interface Task {
  id: string;
  title: string;
  description?: string | null;

  status: TaskStatus;
  priority: TaskPriority;

  projectId: string;
  assigneeId?: string | null;

  project?: {
    id: string;
    name: string;
  };

  assignee?: {
    id: string;
    name: string;
    email?: string;
    image?: string | null;
  } | null;

  dueDate?: string | Date | null;

  commentsCount?: number;
  subtasksCount?: number;

  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId: string;
  assigneeId?: string;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface TaskFilters {
  search?: string;
  status?: TaskStatus | "all";
  priority?: TaskPriority | "all";
  projectId?: string;
  assigneeId?: string;
}