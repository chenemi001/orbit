import { CheckSquare, FolderKanban, Mail } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { formatInitials } from "@/utils/formatters";

export interface TeamMemberData {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  assignedTaskCount: number;
  sharedProjectCount: number;
}

interface TeamMemberCardProps {
  member: TeamMemberData;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/[0.03]">
      <div className="flex items-center gap-3">
        <Avatar
          src={member.avatarUrl ?? undefined}
          fallback={formatInitials(member.name)}
          size="lg"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{member.name}</p>

          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-[var(--muted)]">
            <Mail size={11} />
            {member.email}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4 border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">
        <span className="flex items-center gap-1.5">
          <CheckSquare size={13} />
          {member.assignedTaskCount} tasks
        </span>

        <span className="flex items-center gap-1.5">
          <FolderKanban size={13} />
          {member.sharedProjectCount} projects
        </span>
      </div>
    </div>
  );
}
