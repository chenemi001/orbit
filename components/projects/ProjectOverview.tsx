import { CalendarPlus, CheckCircle2, ListTodo, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, formatStatus } from "@/utils/formatters";
import type { ProjectStatus } from "@/types/project";

interface ProjectOverviewProps {
  status: ProjectStatus;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  memberCount: number;
  createdAt: Date | string;
}

const statusStyles: Record<ProjectStatus, string> = {
  planning:
    "bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  active:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  on_hold:
    "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  completed:
    "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  archived: "bg-[var(--accent)] text-[var(--muted)]",
};

export function ProjectOverview({
  status,
  progress,
  totalTasks,
  completedTasks,
  memberCount,
  createdAt,
}: ProjectOverviewProps) {
  const remainingTasks = totalTasks - completedTasks;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold">Project overview</h2>

            <p className="mt-1 text-xs text-[var(--muted)]">
              Current project performance
            </p>
          </div>

          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-semibold",
              statusStyles[status],
            )}
          >
            {formatStatus(status)}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-semibold tracking-tight">
              {progress}%
            </p>

            <p className="mt-1 text-xs text-[var(--muted)]">
              Overall completion
            </p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--accent)]">
          <div
            className="h-full rounded-full bg-[var(--foreground)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-[var(--accent)] p-3">
            <CheckCircle2 size={15} className="text-[var(--muted)]" />

            <p className="mt-3 text-lg font-semibold">{completedTasks}</p>

            <p className="text-[10px] text-[var(--muted)]">Completed</p>
          </div>

          <div className="rounded-xl bg-[var(--accent)] p-3">
            <ListTodo size={15} className="text-[var(--muted)]" />

            <p className="mt-3 text-lg font-semibold">{remainingTasks}</p>

            <p className="text-[10px] text-[var(--muted)]">Remaining</p>
          </div>

          <div className="rounded-xl bg-[var(--accent)] p-3">
            <Users size={15} className="text-[var(--muted)]" />

            <p className="mt-3 text-lg font-semibold">{memberCount}</p>

            <p className="text-[10px] text-[var(--muted)]">Members</p>
          </div>

          <div className="rounded-xl bg-[var(--accent)] p-3">
            <CalendarPlus size={15} className="text-[var(--muted)]" />

            <p className="mt-3 truncate text-sm font-semibold">
              {formatDate(createdAt)}
            </p>

            <p className="text-[10px] text-[var(--muted)]">Created</p>
          </div>
        </div>
      </div>
    </section>
  );
}
