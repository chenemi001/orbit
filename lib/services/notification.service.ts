import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import type { NewNotification, Notification } from "@/lib/db/types";

export async function getNotificationsByUser(
  userId: string,
): Promise<Notification[]> {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function getUnreadNotifications(
  userId: string,
): Promise<Notification[]> {
  return db
    .select()
    .from(notifications)
    .where(
      and(eq(notifications.userId, userId), eq(notifications.read, false)),
    )
    .orderBy(desc(notifications.createdAt));
}

export async function getUnreadNotificationCount(
  userId: string,
): Promise<number> {
  const unread = await getUnreadNotifications(userId);

  return unread.length;
}

export async function createNotification(
  data: NewNotification,
): Promise<Notification> {
  const result = await db
    .insert(notifications)
    .values(data)
    .returning();

  return result[0];
}

export async function markNotificationAsRead(
  notificationId: string,
  userId: string,
): Promise<Notification | undefined> {
  const result = await db
    .update(notifications)
    .set({
      read: true,
    })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId),
      ),
    )
    .returning();

  return result[0];
}

export async function markAllNotificationsAsRead(
  userId: string,
): Promise<void> {
  await db
    .update(notifications)
    .set({
      read: true,
    })
    .where(eq(notifications.userId, userId));
}

export async function deleteNotification(
  notificationId: string,
): Promise<Notification | undefined> {
  const result = await db
    .delete(notifications)
    .where(eq(notifications.id, notificationId))
    .returning();

  return result[0];
}