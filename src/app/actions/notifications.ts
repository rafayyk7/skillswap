"use server";

import { requireAuth } from "@/lib/api/auth";
import {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/lib/services/notifications";
import { revalidatePath } from "next/cache";

export async function getMyNotifications(options?: {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
}) {
  const session = await requireAuth();
  return getUserNotifications(session.user.id, options);
}

export async function getUnreadCount() {
  const session = await requireAuth();
  return getUnreadNotificationCount(session.user.id);
}

export async function markAsReadAction(notificationId: string) {
  const session = await requireAuth();

  try {
    await markNotificationAsRead(notificationId, session.user.id);
    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to mark as read",
    };
  }
}

export async function markAllAsReadAction() {
  const session = await requireAuth();

  try {
    await markAllNotificationsAsRead(session.user.id);
    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to mark all as read",
    };
  }
}

export async function deleteNotificationAction(notificationId: string) {
  const session = await requireAuth();

  try {
    await deleteNotification(notificationId, session.user.id);
    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete notification",
    };
  }
}

