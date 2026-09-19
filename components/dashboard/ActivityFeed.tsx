import {
  CheckCircle2,
  FileText,
  FolderPlus,
  Pencil,
  Plus,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import { formatRelativeTime } from "@/utils/formatters";
import type { DashboardData } from "@/lib/services/dashboard.service";

interface ActivityFeedProps {
  activity: DashboardData["activity"];
}

const iconByAction: Record<string, LucideIcon> = {
  task_created: Plus,
  task_completed: CheckCircle2,
  task_assigned: UserPlus,
  project_created: FolderPlus,
  project_updated: Pencil,
};

export function ActivityFeed({ activity }: ActivityFeedProps) {
  return (
    <div className="rounded-[20px] border border-[#dfe9e5] bg-white p-5 shadow-[0_8px_30px_rgba(19,50,44,0.035)]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-[#101c19]">
          Recent activity
        </h2>
      </div>

      {activity.length === 0 ? (
        <EmptyState
          title="No activity yet"
          description="Actions across your projects will show up here."
        />
      ) : (
        <div className="space-y-5">
          {activity.map((entry) => {
            const Icon = iconByAction[entry.action] ?? FileText;

            return (
              <div key={entry.id} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e9f7f3] text-[#149777]">
                  <Icon size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#101c19]">
                    {entry.description}
                  </p>
                </div>

                <span className="whitespace-nowrap text-[11px] text-[#80908b]">
                  {formatRelativeTime(entry.createdAt)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
