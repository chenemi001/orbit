import {
  CheckCircle2,
  FileText,
  FolderPlus,
  Pencil,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatInitials, formatRelativeTime } from "@/utils/formatters";

export interface ProjectActivityEntry {
  id: string;
  description: string;
  action: string;
  createdAt: Date | string;
  actor: { id: string; name: string; avatarUrl: string | null } | null;
}

interface ProjectActivityProps {
  activities: ProjectActivityEntry[];
}

const iconByAction: Record<string, LucideIcon> = {
  task_completed: CheckCircle2,
  member_added: UserPlus,
  project_created: FolderPlus,
  project_updated: Pencil,
};

export function ProjectActivity({ activities }: ProjectActivityProps) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2 className="text-sm font-semibold">Recent activity</h2>

        <p className="mt-1 text-xs text-[var(--muted)]">
          Latest updates from this project
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="p-6">
          <EmptyState
            title="No activity yet"
            description="Actions on this project will show up here."
          />
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {activities.map((activity) => {
            const Icon = iconByAction[activity.action] ?? FileText;

            return (
              <div key={activity.id} className="flex gap-3 px-5 py-4">
                <div className="relative shrink-0">
                  {activity.actor ? (
                    <Avatar
                      src={activity.actor.avatarUrl ?? undefined}
                      fallback={formatInitials(activity.actor.name)}
                      size="sm"
                    />
                  ) : (
                    <Avatar fallback="?" size="sm" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-5">{activity.description}</p>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--muted)]">
                    <Icon size={12} />
                    <span>{formatRelativeTime(activity.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
