"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CheckSquare,
  FolderKanban,
  Headphones,
  Inbox,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
];

const analyticsNavigation = [
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

const settingsNavigation = [
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    label: "Help & Support",
    href: "#",
    icon: Headphones,
  },
];

interface SidebarUser {
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface SidebarProps {
  user: SidebarUser;
  unreadCount?: number;
}

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Sidebar({ user, unreadCount = 0 }: SidebarProps) {
  const pathname = usePathname();

  const active = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[264px] flex-col overflow-hidden border-r border-white/10 bg-[#07100f] text-white lg:flex">

      {/* Brand */}
      <div className="flex h-[72px] shrink-0 items-center px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#142522] text-[#9ef7e2]">
            <Sparkles size={20} strokeWidth={2.2} />
          </div>

          <span className="text-[21px] font-semibold tracking-tight">
            Orbit
          </span>
        </Link>
      </div>

      {/* Workspace */}
      <div className="px-4 pb-5">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 text-left transition hover:bg-white/[0.06]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#29433f] text-sm text-[#c8fff3]">
            ◈
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-medium">
              Orbit Workspace
            </p>

            <p className="mt-0.5 truncate text-[12px] text-white/50">
              Personal workspace
            </p>
          </div>

          <span className="text-white/60">⌄</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4">

        <NavLabel>Workspace</NavLabel>

        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = active(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex h-11 items-center gap-3 rounded-xl px-3.5",
                  "text-[14px] transition-all duration-200",
                  isActive
                    ? "bg-[#123d35] text-white shadow-[inset_0_0_0_1px_rgba(110,255,220,0.08)]"
                    : "text-white/65 hover:bg-white/[0.055] hover:text-white"
                )}
              >
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2 : 1.7}
                />

                <span className="flex-1">
                  {item.label}
                </span>

                {item.label === "Inbox" && unreadCount > 0 && (
                  <span className="h-2 w-2 rounded-full bg-[#25c69b]" />
                )}
              </Link>
            );
          })}
        </div>

        <NavLabel className="mt-7">Analytics</NavLabel>

        <div className="space-y-1">
          {analyticsNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = active(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-xl px-3.5",
                  "text-[14px] transition-all",
                  isActive
                    ? "bg-[#123d35] text-white"
                    : "text-white/65 hover:bg-white/[0.055] hover:text-white"
                )}
              >
                <Icon size={19} strokeWidth={1.7} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <NavLabel className="mt-7">Settings</NavLabel>

        <div className="space-y-1">
          {settingsNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex h-11 items-center gap-3 rounded-xl px-3.5 text-[14px] text-white/65 transition hover:bg-white/[0.055] hover:text-white"
              >
                <Icon size={19} strokeWidth={1.7} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Upgrade */}
      <div className="px-4 pb-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#102824] to-[#0b1715] p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#26372e] text-[#ffd66b]">
              <Crown size={17} />
            </div>

            <p className="text-sm font-semibold">
              Upgrade to Pro
            </p>
          </div>

          <p className="text-xs leading-5 text-white/55">
            Unlock advanced features and more team members.
          </p>

          <button
            type="button"
            className="mt-4 h-10 w-full rounded-xl bg-white text-sm font-semibold text-[#07100f] transition hover:bg-white/90"
          >
            Upgrade
          </button>
        </div>
      </div>

      {/* User */}
      <div className="border-t border-white/10 p-4">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/[0.055]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#8061a9] text-sm font-semibold">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              initialsFor(user.name)
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {user.name}
            </p>

            <p className="truncate text-xs text-white/45">
              {user.email}
            </p>
          </div>

          <Settings
            size={17}
            className="text-white/50"
          />
        </Link>
      </div>
    </aside>
  );
}

function NavLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40",
        className
      )}
    >
      {children}
    </p>
  );
}