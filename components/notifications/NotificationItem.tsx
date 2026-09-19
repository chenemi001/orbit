import {
  AtSign,
  Bell,
  CheckCircle2,
  FolderKanban,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/formatters";
import type { NotificationType } from "@/types/notification";

export interface NotificationItemData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date | string;
}

interface NotificationItemProps {
  notification: NotificationItemData;
  onClick?: () => void;
}

const icons: Record<NotificationType, typeof Bell> = {
  task_assigned: UserPlus,
  task_completed: CheckCircle2,
  project_update: FolderKanban,
  mention: AtSign,
  system: Bell,
};

export function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const Icon = icons[notification.type] ?? Bell;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full gap-3 px-4 py-3.5 text-left",
        "border-b border-[var(--border)] last:border-b-0",
        "transition-colors hover:bg-[var(--accent)]",
        !notification.read && "bg-[var(--accent)]/40",
      )}
    >
      <div className="relative shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]">
          <Icon size={14} />
        </div>

        {!notification.read && (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[var(--foreground)] ring-2 ring-[var(--card)]" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "truncate text-xs leading-5",
              !notification.read ? "font-semibold" : "font-medium",
            )}
          >
            {notification.title}
          </p>

          <span className="shrink-0 text-[10px] text-[var(--muted)]">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>

        <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-[var(--muted)]">
          {notification.message}
        </p>
      </div>
    </button>
  );
}
