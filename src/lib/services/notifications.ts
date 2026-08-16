import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, and, desc, sql, isNull } from "drizzle-orm";

export async function getUserNotifications(
  userId: string,
  options: { limit?: number; offset?: number; unreadOnly?: boolean } = {}
) {
  const { limit = 20, offset = 0, unreadOnly = false } = options;

  let whereClause = eq(notifications.userId, userId);

  if (unreadOnly) {
    whereClause = and(whereClause, isNull(notifications.readAt))!;
  }

  const notificationList = await db
    .select()
    .from(notifications)
    .where(whereClause)
    .orderBy(desc(notifications.createdAt))
    .limit(limit)
    .offset(offset);

  return notificationList;
}

export async function getUnreadNotificationCount(userId: string) {
  const result = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(
      and(eq(notifications.userId, userId), isNull(notifications.readAt))
    );

  return result.length;
}

export async function markNotificationAsRead(
  notificationId: string,
  userId: string
) {
  const [notification] = await db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId)
      )
    )
    .limit(1);

  if (!notification) {
    throw new Error("Notification not found");
  }

  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(eq(notifications.id, notificationId));

  return true;
}

export async function markAllNotificationsAsRead(userId: string) {
  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(
      and(eq(notifications.userId, userId), isNull(notifications.readAt))
    );

  return true;
}

export async function deleteNotification(
  notificationId: string,
  userId: string
) {
  await db
    .delete(notifications)
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId)
      )
    );

  return true;
}

export async function createNotification(
  userId: string,
  type: typeof notifications.$inferInsert.type,
  title: string,
  message: string,
  data?: Record<string, unknown>
) {
  const [notification] = await db
    .insert(notifications)
    .values({
      userId,
      type,
      title,
      message,
      data,
    })
    .returning();

  return notification;
}

