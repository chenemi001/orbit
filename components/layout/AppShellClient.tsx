"use client";

import { useState } from "react";
import { Menu, Search } from "lucide-react";

import { UserMenu } from "@/components/shared/UserMenu";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { CommandPalette } from "./CommandPalette";

interface ShellUser {
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface AppShellClientProps {
  user: ShellUser;
  unreadCount: number;
  children: React.ReactNode;
}

export function AppShellClient({
  user,
  unreadCount,
  children,
}: AppShellClientProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useKeyboardShortcut({
    key: "k",
    ctrl: true,
    callback: () => setCommandOpen(true),
  });

  useKeyboardShortcut({
    key: "k",
    meta: true,
    callback: () => setCommandOpen(true),
  });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar user={user} unreadCount={unreadCount} />

      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        user={user}
      />

      <div className="lg:pl-[264px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--background)]/95 px-5 backdrop-blur-md sm:px-7">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--accent)] hover:text-[var(--foreground)] lg:hidden"
          >
            <Menu size={20} />
          </button>

          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            aria-label="Search"
            className="relative hidden h-11 w-full max-w-[620px] items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-left text-sm text-[var(--muted)] shadow-sm transition hover:border-[var(--ring)]/40 sm:flex"
          >
            <Search size={19} />
            <span className="flex-1 truncate">
              Search tasks, projects, or people...
            </span>
            <span className="rounded-md bg-[var(--accent)] px-2 py-1 text-[11px] text-[var(--muted)]">
              Ctrl K
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--accent)] hover:text-[var(--foreground)] sm:hidden"
          >
            <Search size={19} />
          </button>

          <UserMenu user={user} unreadCount={unreadCount} />
        </header>

        {/* Page */}
        <main className="px-5 py-7 sm:px-7 lg:px-9">
          {children}
        </main>
      </div>

      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
      />
    </div>
  );
}
