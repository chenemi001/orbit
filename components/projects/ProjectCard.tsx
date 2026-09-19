import Link from "next/link";
import { ArrowUpRight, CheckCircle2, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/project";
import { formatStatus } from "@/utils/formatters";

export interface ProjectCardData {
  id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  progress: number;
  stats: { total: number; completed: number };
}

interface ProjectCardProps {
  project: ProjectCardData;
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

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className={cn(
        "group block rounded-2xl border border-[var(--border)]",
        "bg-[var(--card)] p-5",
        "transition-all duration-200",
        "hover:-translate-y-0.5",
        "hover:border-[var(--foreground)]/15",
        "hover:shadow-lg hover:shadow-black/[0.03]",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]">
          <FolderKanban size={18} />
        </div>

        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[10px] font-semibold",
            statusStyles[project.status],
          )}
        >
          {formatStatus(project.status)}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold">{project.name}</h3>

          <ArrowUpRight
            size={14}
            className="shrink-0 text-[var(--muted)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
          />
        </div>

        <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-5 text-[var(--muted)]">
          {project.description || "No description yet."}
        </p>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] text-[var(--muted)]">Progress</span>

          <span className="text-xs font-semibold">{project.progress}%</span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--accent)]">
          <div
            className="h-full rounded-full bg-[var(--foreground)] transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end border-t border-[var(--border)] pt-4">
        <div className="flex items-center gap-1 text-[11px] text-[var(--muted)]">
          <CheckCircle2 size={12} />
          {project.stats.completed}/{project.stats.total} tasks
        </div>
      </div>
    </Link>
  );
}
