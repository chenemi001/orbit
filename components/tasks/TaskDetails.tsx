"use client";

import {
  CalendarDays,
  CheckCircle2,
  FolderKanban,
  Pencil,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import type { Task } from "@/types/task";
import { formatDate, formatInitials } from "@/utils/formatters";
import { Avatar } from "@/components/ui/Avatar";
import { TaskStatusBadge } from "./TaskStatusBadge";

interface TaskDetailsProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  busy?: boolean;
}

export function TaskDetails({
  task,
  onEdit,
  onDelete,
  onComplete,
  busy = false,
}: TaskDetailsProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5">
        <div>
          <TaskStatusBadge status={task.status} />

          <h2 className="mt-3 text-lg font-semibold">{task.title}</h2>

          {task.description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-[var(--card)] p-4">
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <User size={14} />
            <span className="text-[10px]">Assignee</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            {task.assignee ? (
              <Avatar
                src={task.assignee.image ?? undefined}
                fallback={formatInitials(task.assignee.name)}
                size="sm"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)]">
                <User size={13} />
              </div>
            )}

            <span className="truncate text-xs font-medium">
              {task.assignee?.name ?? "Unassigned"}
            </span>
          </div>
        </div>

        <div className="bg-[var(--card)] p-4">
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <CalendarDays size={14} />
            <span className="text-[10px]">Due date</span>
          </div>

          <p className="mt-3 text-xs font-medium">
            {task.dueDate ? formatDate(task.dueDate) : "No due date"}
          </p>
        </div>

        <div className="bg-[var(--card)] p-4">
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <Tag size={14} />
            <span className="text-[10px]">Priority</span>
          </div>

          <p className="mt-3 text-xs font-semibold capitalize">
            {task.priority}
          </p>
        </div>

        <div className="bg-[var(--card)] p-4">
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <FolderKanban size={14} />
            <span className="text-[10px]">Project</span>
          </div>

          <p className="truncate mt-3 text-xs font-medium">
            {task.project?.name ?? "—"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] p-4">
        <button
          type="button"
          onClick={onEdit}
          disabled={busy}
          className="flex h-9 items-center gap-2 rounded-lg bg-[var(--foreground)] px-3 text-xs font-medium text-[var(--background)] disabled:opacity-50"
        >
          <Pencil size={13} />
          Edit task
        </button>

        {task.status !== "completed" && (
          <button
            type="button"
            onClick={onComplete}
            disabled={busy}
            className="flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] px-3 text-xs font-medium transition-colors hover:bg-[var(--accent)] disabled:opacity-50"
          >
            <CheckCircle2 size={13} />
            Mark complete
          </button>
        )}

        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="flex h-9 items-center gap-2 rounded-lg border border-[var(--danger)]/30 px-3 text-xs font-medium text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/10 disabled:opacity-50"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </section>
  );
}
