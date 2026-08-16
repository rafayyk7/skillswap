"use server";

import { requireAuth } from "@/lib/api/auth";
import {
  getUserConversations,
  getConversation,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
} from "@/lib/services/messaging";
import { sendMessageSchema } from "@/lib/api/validations";
import { revalidatePath } from "next/cache";

export async function getMyConversations() {
  const session = await requireAuth();
  return getUserConversations(session.user.id);
}

export async function getConversationDetails(conversationId: string) {
  const session = await requireAuth();
  return getConversation(conversationId, session.user.id);
}

export async function getConversationMessages(
  conversationId: string,
  options?: { limit?: number; before?: string }
) {
  const session = await requireAuth();
  return getMessages(conversationId, session.user.id, options);
}

export async function sendMessageAction(formData: FormData) {
  const session = await requireAuth();

  const rawData = {
    conversationId: formData.get("conversationId") as string,
    body: formData.get("body") as string,
  };

  const validation = sendMessageSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return { error: firstError?.message || "Invalid input" };
  }

  try {
    const message = await sendMessage(
      validation.data.conversationId,
      session.user.id,
      validation.data.body
    );
    revalidatePath(`/messages/${validation.data.conversationId}`);
    return { success: true, message };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to send message",
    };
  }
}

export async function markConversationAsRead(conversationId: string) {
  const session = await requireAuth();

  try {
    await markAsRead(conversationId, session.user.id);
    revalidatePath("/messages");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to mark as read",
    };
  }
}

export async function deleteMessageAction(messageId: string) {
  const session = await requireAuth();

  try {
    await deleteMessage(messageId, session.user.id);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete message",
    };
  }
}

