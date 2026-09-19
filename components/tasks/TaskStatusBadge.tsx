import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types/task";

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

const labels: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  in_review: "In review",
  completed: "Completed",
};

const styles: Record<TaskStatus, string> = {
  todo: "bg-[var(--accent)] text-[var(--muted)]",
  in_progress:
    "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  in_review:
    "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  completed:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

export function TaskStatusBadge({
  status,
  className,
}: TaskStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
        "text-[9px] font-semibold",
        styles[status],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />

      {labels[status]}
    </span>
  );
}
