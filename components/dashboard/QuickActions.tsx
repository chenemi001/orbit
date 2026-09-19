import Link from "next/link";
import { BarChart3, FolderKanban, Plus, Users } from "lucide-react";

const actions = [
  {
    icon: Plus,
    title: "Create task",
    description: "Add a new task",
    href: "/tasks?new=true",
  },
  {
    icon: FolderKanban,
    title: "New project",
    description: "Start a project",
    href: "/projects?new=true",
  },
  {
    icon: Users,
    title: "Invite team",
    description: "Collaborate",
    href: "/team?invite=true",
  },
  {
    icon: BarChart3,
    title: "View reports",
    description: "See insights",
    href: "/analytics",
  },
];

export function QuickActions() {
  return (
    <div className="rounded-[20px] border border-[#dfe9e5] bg-white p-5 shadow-[0_8px_30px_rgba(19,50,44,0.035)]">
      <h2 className="mb-5 text-[17px] font-semibold text-[#101c19]">
        Quick actions
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="flex min-h-[72px] items-center gap-3 rounded-xl border border-[#e4ebe8] p-3 text-left transition hover:border-[#cbdcd6] hover:bg-[#f7faf9]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f7f3] text-[#149777]">
              <action.icon size={19} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#101c19]">
                {action.title}
              </p>

              <p className="mt-1 truncate text-[10px] text-[#75847f]">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
