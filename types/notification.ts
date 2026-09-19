export type NotificationType =
  | "task_assigned"
  | "task_completed"
  | "project_update"
  | "mention"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  userId: string;
  actorId?: string;
  actorName?: string;
  actorImage?: string;
  resourceId?: string;
  resourceType?: string;
  createdAt: string | Date;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}