"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  NotificationItem,
  type NotificationItemData,
} from "@/components/notifications/NotificationItem";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItemData[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch("/api/notifications");
      if (!response.ok) throw new Error("Failed to load notifications");

      const body = await response.json();
      setNotifications(body.data?.notifications ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function markAsRead(id: string) {
    setNotifications((current) =>
      current.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
  }

  async function markAllAsRead() {
    setNotifications((current) => current.map((n) => ({ ...n, read: true })));

    await fetch("/api/notifications/read-all", { method: "POST" });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Notifications"
        description={
          unreadCount > 0
            ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`
            : "You're all caught up."
        }
        actions={
          unreadCount > 0 ? (
            <button
              type="button"
              onClick={markAllAsRead}
              className="flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] px-3 text-xs font-medium transition-colors hover:bg-[var(--accent)]"
            >
              <CheckCheck size={14} />
              Mark all as read
            </button>
          ) : undefined
        }
      />

      {loading ? (
        <LoadingState message="Loading notifications..." />
      ) : error ? (
        <ErrorState onRetry={load} message="Unable to load notifications." />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell size={20} strokeWidth={1.8} />}
          title="No notifications yet"
          description="Activity across your projects will show up here."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => markAsRead(notification.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
