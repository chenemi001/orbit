"use client";

import { CalendarDays, MoreHorizontal, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, formatInitials } from "@/utils/formatters";
import type { Task } from "@/types/task";
import { TaskStatusBadge } from "./TaskStatusBadge";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const priorityStyles: Record<string, string> = {
  low: "text-[var(--muted)]",
  medium: "text-blue-600",
  high: "text-amber-600",
  urgent: "text-red-600",
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <article
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("taskId", task.id);
      }}
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-xl border border-[var(--border)]",
        "bg-[var(--card)] p-4",
        "active:cursor-grabbing",
        "transition-all duration-200",
        "hover:-translate-y-0.5",
        "hover:border-[var(--foreground)]/15",
        "hover:shadow-md hover:shadow-black/[0.03]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <TaskStatusBadge status={task.status} />

        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted)] opacity-0 transition-all hover:bg-[var(--accent)] group-hover:opacity-100"
          aria-label="Task options"
        >
          <MoreHorizontal size={15} />
        </button>
      </div>

      <h3 className="mt-3 text-sm font-semibold leading-5">{task.title}</h3>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[var(--muted)]">
          {task.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span
          className={cn(
            "text-[10px] font-semibold capitalize",
            priorityStyles[task.priority]
          )}
        >
          {task.priority}
        </span>

        {task.project && (
          <span className="truncate rounded-md bg-[var(--accent)] px-2 py-1 text-[10px] font-medium text-[var(--muted)]">
            {task.project.name}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
        <div className="flex items-center gap-3 text-[var(--muted)]">
          {task.dueDate && (
            <span className="flex items-center gap-1 text-[10px]">
              <CalendarDays size={12} />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {task.assignee ? (
          <Avatar
            src={task.assignee.image ?? undefined}
            fallback={formatInitials(task.assignee.name)}
            size="sm"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--muted)]">
            <User size={13} />
          </div>
        )}
      </div>
    </article>
  );
}
