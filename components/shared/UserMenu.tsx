"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";

interface UserMenuUser {
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface UserMenuProps {
  user: UserMenuUser;
  unreadCount?: number;
}

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserMenu({ user, unreadCount = 0 }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      window.location.href = "/login";
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <div className="flex items-center gap-3">

      {/* Notifications */}
      <Link
        href="/notifications"
        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#dfe8e5] bg-white text-[#14201e] shadow-sm transition hover:bg-[#f5f8f7]"
        aria-label="Notifications"
      >
        <Bell size={19} strokeWidth={1.8} />

        {unreadCount > 0 && (
          <span className="absolute right-2.5 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
        )}
      </Link>

      {/* User */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-[#f2f6f4]"
          aria-expanded={open}
        >
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#8061a9] text-sm font-semibold text-white">
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

          <div className="hidden text-left sm:block">
            <p className="text-[13px] font-semibold text-[#17211f]">
              {user.name}
            </p>

            <p className="text-[12px] text-[#71807c]">
              Free Plan
            </p>
          </div>

          <ChevronDown
            size={16}
            className={`text-[#53625e] transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />

            <div className="absolute right-0 top-14 z-50 w-60 overflow-hidden rounded-2xl border border-[#dfe8e5] bg-white p-2 shadow-xl">

              <div className="border-b border-[#edf1ef] px-3 py-3">
                <p className="text-sm font-semibold text-[#17211f]">
                  {user.name}
                </p>

                <p className="mt-1 text-xs text-[#71807c]">
                  {user.email}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#34413e] hover:bg-[#f3f7f5]"
                >
                  <User size={16} />
                  Profile
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#34413e] hover:bg-[#f3f7f5]"
                >
                  <Settings size={16} />
                  Settings
                </Link>
              </div>

              <div className="border-t border-[#edf1ef] pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <LogOut size={16} />

                  {loggingOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}