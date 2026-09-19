import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count?: number;
  className?: string;
}

export function NotificationBadge({
  count = 0,
  className,
}: NotificationBadgeProps) {
  return (
    <button
      type="button"
      aria-label={
        count > 0
          ? `${count} unread notifications`
          : "Notifications"
      }
      className={cn(
        "relative flex h-9 w-9 items-center justify-center",
        "rounded-lg text-[var(--muted)]",
        "transition-colors",
        "hover:bg-[var(--accent)] hover:text-[var(--foreground)]",
        className
      )}
    >
      <Bell size={18} strokeWidth={1.8} />

      {count > 0 && (
        <span className="absolute right-1 top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[var(--foreground)] px-1 text-[9px] font-bold leading-none text-[var(--background)]">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}