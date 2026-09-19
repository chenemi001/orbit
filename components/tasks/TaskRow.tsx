import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, formatInitials } from "@/utils/formatters";
import type { Task } from "@/types/task";
import { TaskStatusBadge } from "./TaskStatusBadge";

interface TaskRowProps {
  task: Task;
  onClick?: () => void;
}

const priorityStyles: Record<string, string> = {
  low: "bg-[var(--accent)] text-[var(--muted)]",
  medium: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  high: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  urgent: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function TaskRow({ task, onClick }: TaskRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full grid-cols-[minmax(220px,1.8fr)_130px_110px_130px_100px] items-center gap-4 border-b border-[var(--border)] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--accent)]/40"
    >
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold">{task.title}</p>

        <p className="mt-0.5 truncate text-[10px] text-[var(--muted)]">
          {task.project?.name ?? "—"}
        </p>
      </div>

      <div>
        <TaskStatusBadge status={task.status} />
      </div>

      <div>
        <span
          className={cn(
            "rounded-full px-2 py-1 text-[9px] font-semibold capitalize",
            priorityStyles[task.priority],
          )}
        >
          {task.priority}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {task.assignee ? (
          <>
            <Avatar
              src={task.assignee.image ?? undefined}
              fallback={formatInitials(task.assignee.name)}
              size="sm"
            />

            <span className="truncate text-[10px] font-medium">
              {task.assignee.name}
            </span>
          </>
        ) : (
          <span className="text-[10px] text-[var(--muted)]">Unassigned</span>
        )}
      </div>

      <div className="flex items-center gap-1 text-[10px] text-[var(--muted)]">
        {task.dueDate && (
          <>
            <CalendarDays size={12} />
            {formatDate(task.dueDate)}
          </>
        )}
      </div>
    </button>
  );
}
