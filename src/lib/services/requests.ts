import { db } from "@/db";
import {
  swapRequests,
  swaps,
  users,
  profiles,
  skills,
  conversations,
  conversationParticipants,
  notifications,
} from "@/db/schema";
import { eq, and, or, desc, ne, inArray } from "drizzle-orm";
import type { CreateSwapRequestInput } from "@/lib/api/validations";

export async function createSwapRequest(
  requesterId: string,
  input: CreateSwapRequestInput
) {
  const {
    recipientId,
    teachingSkillId,
    learningSkillId,
    proposedDuration,
    proposedSchedule,
    message,
  } = input;

  // Validate not sending to self
  if (requesterId === recipientId) {
    throw new Error("Cannot send request to yourself");
  }

  // Check recipient exists and is active
  const [recipient] = await db
    .select({ id: users.id, status: users.status })
    .from(users)
    .where(eq(users.id, recipientId))
    .limit(1);

  if (!recipient || recipient.status !== "active") {
    throw new Error("Recipient not found or not active");
  }

  // Check for existing pending request between these users
  const [existingRequest] = await db
    .select({ id: swapRequests.id })
    .from(swapRequests)
    .where(
      and(
        eq(swapRequests.status, "pending"),
        or(
          and(
            eq(swapRequests.requesterId, requesterId),
            eq(swapRequests.recipientId, recipientId)
          ),
          and(
            eq(swapRequests.requesterId, recipientId),
            eq(swapRequests.recipientId, requesterId)
          )
        )
      )
    )
    .limit(1);

  if (existingRequest) {
    throw new Error("A pending request already exists between you and this user");
  }

  // Get requester profile for notification
  const [requesterProfile] = await db
    .select({ displayName: profiles.displayName })
    .from(profiles)
    .where(eq(profiles.userId, requesterId))
    .limit(1);

  // Create the request
  const [request] = await db
    .insert(swapRequests)
    .values({
      requesterId,
      recipientId,
      requesterTeachingSkillId: teachingSkillId,
      requesterLearningSkillId: learningSkillId,
      proposedDuration,
      proposedSchedule,
      message,
      status: "pending",
    })
    .returning();

  // Create notification for recipient
  await db.insert(notifications).values({
    userId: recipientId,
    type: "new_request",
    title: "New Skill Swap Request",
    message: `${requesterProfile?.displayName || "Someone"} wants to swap skills with you!`,
    data: { requestId: request.id, requesterId },
  });

  return request;
}

export async function getSwapRequest(requestId: string, userId: string) {
  const [request] = await db
    .select({
      id: swapRequests.id,
      requesterId: swapRequests.requesterId,
      recipientId: swapRequests.recipientId,
      proposedDuration: swapRequests.proposedDuration,
      proposedSchedule: swapRequests.proposedSchedule,
      message: swapRequests.message,
      status: swapRequests.status,
      createdAt: swapRequests.createdAt,
      respondedAt: swapRequests.respondedAt,
      requesterTeachingSkill: {
        id: skills.id,
        name: skills.name,
      },
    })
    .from(swapRequests)
    .innerJoin(skills, eq(swapRequests.requesterTeachingSkillId, skills.id))
    .where(
      and(
        eq(swapRequests.id, requestId),
        or(
          eq(swapRequests.requesterId, userId),
          eq(swapRequests.recipientId, userId)
        )
      )
    )
    .limit(1);

  if (!request) return null;

  // Get learning skill separately
  const [learningSkill] = await db
    .select({ id: skills.id, name: skills.name })
    .from(skills)
    .innerJoin(
      swapRequests,
      eq(skills.id, swapRequests.requesterLearningSkillId)
    )
    .where(eq(swapRequests.id, requestId))
    .limit(1);

  // Get user profiles
  const [requesterProfile] = await db
    .select({
      username: profiles.username,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(profiles)
    .where(eq(profiles.userId, request.requesterId))
    .limit(1);

  const [recipientProfile] = await db
    .select({
      username: profiles.username,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(profiles)
    .where(eq(profiles.userId, request.recipientId))
    .limit(1);

  return {
    ...request,
    requesterLearningSkill: learningSkill,
    requester: requesterProfile,
    recipient: recipientProfile,
  };
}

export async function getUserRequests(
  userId: string,
  type: "sent" | "received" | "all" = "all",
  status?: "pending" | "accepted" | "declined" | "cancelled" | "expired"
) {
  let whereClause;

  if (type === "sent") {
    whereClause = eq(swapRequests.requesterId, userId);
  } else if (type === "received") {
    whereClause = eq(swapRequests.recipientId, userId);
  } else {
    whereClause = or(
      eq(swapRequests.requesterId, userId),
      eq(swapRequests.recipientId, userId)
    );
  }

  if (status) {
    whereClause = and(whereClause, eq(swapRequests.status, status));
  }

  const requests = await db
    .select({
      id: swapRequests.id,
      requesterId: swapRequests.requesterId,
      recipientId: swapRequests.recipientId,
      proposedDuration: swapRequests.proposedDuration,
      message: swapRequests.message,
      status: swapRequests.status,
      createdAt: swapRequests.createdAt,
    })
    .from(swapRequests)
    .where(whereClause)
    .orderBy(desc(swapRequests.createdAt));

  // Enrich with profiles and skills
  const enrichedRequests = await Promise.all(
    requests.map(async (req) => {
      const [requesterProfile] = await db
        .select({
          username: profiles.username,
          displayName: profiles.displayName,
          avatarUrl: profiles.avatarUrl,
        })
        .from(profiles)
        .where(eq(profiles.userId, req.requesterId))
        .limit(1);

      const [recipientProfile] = await db
        .select({
          username: profiles.username,
          displayName: profiles.displayName,
          avatarUrl: profiles.avatarUrl,
        })
        .from(profiles)
        .where(eq(profiles.userId, req.recipientId))
        .limit(1);

      const [teachingSkill] = await db
        .select({ id: skills.id, name: skills.name })
        .from(skills)
        .innerJoin(
          swapRequests,
          eq(skills.id, swapRequests.requesterTeachingSkillId)
        )
        .where(eq(swapRequests.id, req.id))
        .limit(1);

      const [learningSkill] = await db
        .select({ id: skills.id, name: skills.name })
        .from(skills)
        .innerJoin(
          swapRequests,
          eq(skills.id, swapRequests.requesterLearningSkillId)
        )
        .where(eq(swapRequests.id, req.id))
        .limit(1);

      return {
        ...req,
        requester: requesterProfile,
        recipient: recipientProfile,
        teachingSkill,
        learningSkill,
      };
    })
  );

  return enrichedRequests;
}

export async function acceptRequest(requestId: string, userId: string) {
  // Get and validate request
  const [request] = await db
    .select()
    .from(swapRequests)
    .where(
      and(
        eq(swapRequests.id, requestId),
        eq(swapRequests.recipientId, userId),
        eq(swapRequests.status, "pending")
      )
    )
    .limit(1);

  if (!request) {
    throw new Error("Request not found or already processed");
  }

  // Get user profile for notification
  const [userProfile] = await db
    .select({ displayName: profiles.displayName })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  // Transaction: update request, create swap, create conversation
  const result = await db.transaction(async (tx) => {
    // Update request status
    await tx
      .update(swapRequests)
      .set({
        status: "accepted",
        respondedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(swapRequests.id, requestId));

    // Create swap
    const [swap] = await tx
      .insert(swaps)
      .values({
        requestId: request.id,
        userAId: request.requesterId,
        userBId: request.recipientId,
        userATeachingSkillId: request.requesterTeachingSkillId,
        userBTeachingSkillId: request.requesterLearningSkillId,
        agreedDuration: request.proposedDuration,
        status: "active",
      })
      .returning();

    // Create conversation for this swap
    const [conversation] = await tx
      .insert(conversations)
      .values({ swapId: swap.id })
      .returning();

    // Add both users to conversation
    await tx.insert(conversationParticipants).values([
      { conversationId: conversation.id, userId: request.requesterId },
      { conversationId: conversation.id, userId: request.recipientId },
    ]);

    // Notify requester
    await tx.insert(notifications).values({
      userId: request.requesterId,
      type: "request_accepted",
      title: "Request Accepted!",
      message: `${userProfile?.displayName || "Your match"} accepted your skill swap request!`,
      data: { requestId: request.id, swapId: swap.id },
    });

    return { swap, conversation };
  });

  return result;
}

export async function declineRequest(requestId: string, userId: string) {
  const [request] = await db
    .select()
    .from(swapRequests)
    .where(
      and(
        eq(swapRequests.id, requestId),
        eq(swapRequests.recipientId, userId),
        eq(swapRequests.status, "pending")
      )
    )
    .limit(1);

  if (!request) {
    throw new Error("Request not found or already processed");
  }

  const [userProfile] = await db
    .select({ displayName: profiles.displayName })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  await db.transaction(async (tx) => {
    await tx
      .update(swapRequests)
      .set({
        status: "declined",
        respondedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(swapRequests.id, requestId));

    await tx.insert(notifications).values({
      userId: request.requesterId,
      type: "request_declined",
      title: "Request Declined",
      message: `${userProfile?.displayName || "A user"} declined your skill swap request.`,
      data: { requestId: request.id },
    });
  });

  return true;
}

export async function cancelRequest(requestId: string, userId: string) {
  const [request] = await db
    .select()
    .from(swapRequests)
    .where(
      and(
        eq(swapRequests.id, requestId),
        eq(swapRequests.requesterId, userId),
        eq(swapRequests.status, "pending")
      )
    )
    .limit(1);

  if (!request) {
    throw new Error("Request not found or cannot be cancelled");
  }

  await db
    .update(swapRequests)
    .set({
      status: "cancelled",
      updatedAt: new Date(),
    })
    .where(eq(swapRequests.id, requestId));

  // Notify recipient
  const [userProfile] = await db
    .select({ displayName: profiles.displayName })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  await db.insert(notifications).values({
    userId: request.recipientId,
    type: "request_cancelled",
    title: "Request Cancelled",
    message: `${userProfile?.displayName || "A user"} cancelled their skill swap request.`,
    data: { requestId: request.id },
  });

  return true;
}

export async function getPendingRequestCount(userId: string) {
  const result = await db
    .select({ id: swapRequests.id })
    .from(swapRequests)
    .where(
      and(
        eq(swapRequests.recipientId, userId),
        eq(swapRequests.status, "pending")
      )
    );

  return result.length;
}

