import { db } from "@/db";
import {
  conversations,
  conversationParticipants,
  messages,
  messageAttachments,
  profiles,
  notifications,
} from "@/db/schema";
import { eq, and, desc, gt, sql, inArray } from "drizzle-orm";

export async function getUserConversations(userId: string) {
  // Get all conversations user is part of
  const participations = await db
    .select({ conversationId: conversationParticipants.conversationId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, userId));

  const conversationIds = participations.map((p) => p.conversationId);

  if (conversationIds.length === 0) {
    return [];
  }

  const convos = await db
    .select({
      id: conversations.id,
      swapId: conversations.swapId,
      updatedAt: conversations.updatedAt,
    })
    .from(conversations)
    .where(inArray(conversations.id, conversationIds))
    .orderBy(desc(conversations.updatedAt));

  // Enrich with last message and partner info
  const enrichedConversations = await Promise.all(
    convos.map(async (convo) => {
      // Get partner
      const [partner] = await db
        .select({
          id: conversationParticipants.userId,
          username: profiles.username,
          displayName: profiles.displayName,
          avatarUrl: profiles.avatarUrl,
        })
        .from(conversationParticipants)
        .innerJoin(
          profiles,
          eq(conversationParticipants.userId, profiles.userId)
        )
        .where(
          and(
            eq(conversationParticipants.conversationId, convo.id),
            sql`${conversationParticipants.userId} != ${userId}`
          )
        )
        .limit(1);

      // Get last message
      const [lastMessage] = await db
        .select({
          id: messages.id,
          body: messages.body,
          senderId: messages.senderId,
          createdAt: messages.createdAt,
        })
        .from(messages)
        .where(
          and(
            eq(messages.conversationId, convo.id),
            sql`${messages.deletedAt} IS NULL`
          )
        )
        .orderBy(desc(messages.createdAt))
        .limit(1);

      // Get unread count
      const [participation] = await db
        .select({ lastReadAt: conversationParticipants.lastReadAt })
        .from(conversationParticipants)
        .where(
          and(
            eq(conversationParticipants.conversationId, convo.id),
            eq(conversationParticipants.userId, userId)
          )
        )
        .limit(1);

      let unreadCount = 0;
      if (participation?.lastReadAt) {
        const unread = await db
          .select({ id: messages.id })
          .from(messages)
          .where(
            and(
              eq(messages.conversationId, convo.id),
              gt(messages.createdAt, participation.lastReadAt),
              sql`${messages.senderId} != ${userId}`,
              sql`${messages.deletedAt} IS NULL`
            )
          );
        unreadCount = unread.length;
      } else {
        const unread = await db
          .select({ id: messages.id })
          .from(messages)
          .where(
            and(
              eq(messages.conversationId, convo.id),
              sql`${messages.senderId} != ${userId}`,
              sql`${messages.deletedAt} IS NULL`
            )
          );
        unreadCount = unread.length;
      }

      return {
        ...convo,
        partner,
        lastMessage,
        unreadCount,
      };
    })
  );

  return enrichedConversations;
}

export async function getConversation(conversationId: string, userId: string) {
  // Verify user is participant
  const [participation] = await db
    .select()
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId)
      )
    )
    .limit(1);

  if (!participation) {
    throw new Error("Conversation not found");
  }

  const [convo] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  // Get partner
  const [partner] = await db
    .select({
      id: conversationParticipants.userId,
      username: profiles.username,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(conversationParticipants)
    .innerJoin(profiles, eq(conversationParticipants.userId, profiles.userId))
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        sql`${conversationParticipants.userId} != ${userId}`
      )
    )
    .limit(1);

  return {
    ...convo,
    partner,
  };
}

export async function getMessages(
  conversationId: string,
  userId: string,
  options: { limit?: number; before?: string } = {}
) {
  const { limit = 50, before } = options;

  // Verify user is participant
  const [participation] = await db
    .select()
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId)
      )
    )
    .limit(1);

  if (!participation) {
    throw new Error("Conversation not found");
  }

  let query = db
    .select({
      id: messages.id,
      body: messages.body,
      type: messages.type,
      senderId: messages.senderId,
      createdAt: messages.createdAt,
      editedAt: messages.editedAt,
    })
    .from(messages)
    .where(
      and(
        eq(messages.conversationId, conversationId),
        sql`${messages.deletedAt} IS NULL`
      )
    )
    .orderBy(desc(messages.createdAt))
    .limit(limit);

  const messageList = await query;

  // Enrich with sender profile and attachments
  const enrichedMessages = await Promise.all(
    messageList.map(async (msg) => {
      const [senderProfile] = await db
        .select({
          username: profiles.username,
          displayName: profiles.displayName,
          avatarUrl: profiles.avatarUrl,
        })
        .from(profiles)
        .where(eq(profiles.userId, msg.senderId))
        .limit(1);

      const attachments = await db
        .select()
        .from(messageAttachments)
        .where(eq(messageAttachments.messageId, msg.id));

      return {
        ...msg,
        sender: { id: msg.senderId, ...senderProfile },
        attachments,
        isOwn: msg.senderId === userId,
      };
    })
  );

  // Return in chronological order
  return enrichedMessages.reverse();
}

export async function sendMessage(
  conversationId: string,
  userId: string,
  body: string,
  type: "text" | "file" | "system" = "text"
) {
  // Verify user is participant
  const [participation] = await db
    .select()
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId)
      )
    )
    .limit(1);

  if (!participation) {
    throw new Error("Conversation not found");
  }

  const [message] = await db.transaction(async (tx) => {
    // Insert message
    const [msg] = await tx
      .insert(messages)
      .values({
        conversationId,
        senderId: userId,
        body,
        type,
      })
      .returning();

    // Update conversation timestamp
    await tx
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    // Update sender's last read
    await tx
      .update(conversationParticipants)
      .set({ lastReadAt: new Date() })
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          eq(conversationParticipants.userId, userId)
        )
      );

    return [msg];
  });

  // Get sender profile for notification
  const [senderProfile] = await db
    .select({ displayName: profiles.displayName })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  // Notify other participants
  const otherParticipants = await db
    .select({ userId: conversationParticipants.userId })
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        sql`${conversationParticipants.userId} != ${userId}`
      )
    );

  for (const participant of otherParticipants) {
    await db.insert(notifications).values({
      userId: participant.userId,
      type: "new_message",
      title: "New Message",
      message: `${senderProfile?.displayName || "Someone"}: ${body.substring(0, 100)}${body.length > 100 ? "..." : ""}`,
      data: { conversationId, messageId: message.id },
    });
  }

  return message;
}

export async function markAsRead(conversationId: string, userId: string) {
  await db
    .update(conversationParticipants)
    .set({ lastReadAt: new Date() })
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId)
      )
    );
}

export async function deleteMessage(messageId: string, userId: string) {
  const [message] = await db
    .select()
    .from(messages)
    .where(and(eq(messages.id, messageId), eq(messages.senderId, userId)))
    .limit(1);

  if (!message) {
    throw new Error("Message not found or you cannot delete it");
  }

  await db
    .update(messages)
    .set({ deletedAt: new Date() })
    .where(eq(messages.id, messageId));

  return true;
}

export async function getUnreadMessageCount(userId: string) {
  const participations = await db
    .select({
      conversationId: conversationParticipants.conversationId,
      lastReadAt: conversationParticipants.lastReadAt,
    })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, userId));

  let totalUnread = 0;

  for (const p of participations) {
    let unreadQuery;
    if (p.lastReadAt) {
      unreadQuery = await db
        .select({ id: messages.id })
        .from(messages)
        .where(
          and(
            eq(messages.conversationId, p.conversationId),
            gt(messages.createdAt, p.lastReadAt),
            sql`${messages.senderId} != ${userId}`,
            sql`${messages.deletedAt} IS NULL`
          )
        );
    } else {
      unreadQuery = await db
        .select({ id: messages.id })
        .from(messages)
        .where(
          and(
            eq(messages.conversationId, p.conversationId),
            sql`${messages.senderId} != ${userId}`,
            sql`${messages.deletedAt} IS NULL`
          )
        );
    }
    totalUnread += unreadQuery.length;
  }

  return totalUnread;
}

