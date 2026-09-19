export const REALTIME_EVENTS = {
  TASK_CREATED: "task.created",
  TASK_UPDATED: "task.updated",
  TASK_DELETED: "task.deleted",

  PROJECT_CREATED: "project.created",
  PROJECT_UPDATED: "project.updated",
  PROJECT_DELETED: "project.deleted",

  COMMENT_CREATED: "comment.created",

  NOTIFICATION_CREATED:
    "notification.created",

  MEMBER_JOINED: "member.joined",
  MEMBER_LEFT: "member.left",
} as const;

export type RealtimeEvent =
  (typeof REALTIME_EVENTS)[keyof typeof REALTIME_EVENTS];

export interface RealtimePayload<
  T = unknown
> {
  event: RealtimeEvent;
  data: T;
  timestamp: string;
}