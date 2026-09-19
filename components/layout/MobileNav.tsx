"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CheckSquare,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";

interface MobileNavUser {
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  user: MobileNavUser;
}

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Inbox",
    href: "/notifications",
    icon: Inbox,
  },
  {
    label: "Team",
    href: "/team",
    icon: Users,
  },
  {
    label: "AI Assistant",
    href: "/ai",
    icon: Sparkles,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function MobileNav({
  open,
  onClose,
  user,
}: MobileNavProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <aside
        className={cn(
          "relative flex h-full w-[280px] flex-col",
          "border-r border-[var(--border)]",
          "bg-[var(--background)]",
          "shadow-2xl"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-5">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--foreground)] text-[var(--background)]">
              <span className="text-sm font-bold">O</span>
            </div>

            <span className="text-[15px] font-semibold tracking-tight">
              Orbit
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* User */}
        <div className="px-3 pb-4">
          <div className="flex items-center gap-3 rounded-xl bg-[var(--accent)] p-3">
            <Avatar
              src={user.avatarUrl ?? undefined}
              fallback={initialsFor(user.name)}
              size="md"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {user.name}
              </p>
              <p className="truncate text-xs text-[var(--muted)]">
                Orbit Workspace
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3",
                    "text-sm font-medium transition-colors",
                    active
                      ? "bg-[var(--accent)] text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
                  )}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </div>
  );
}