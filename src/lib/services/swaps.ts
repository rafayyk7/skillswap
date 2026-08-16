import { db } from "@/db";
import {
  swaps,
  swapRequests,
  users,
  profiles,
  skills,
  learningSessions,
  conversations,
  notifications,
} from "@/db/schema";
import { eq, and, or, desc, sql } from "drizzle-orm";

export async function getSwap(swapId: string, userId: string) {
  const [swap] = await db
    .select({
      id: swaps.id,
      userAId: swaps.userAId,
      userBId: swaps.userBId,
      status: swaps.status,
      agreedDuration: swaps.agreedDuration,
      totalSessionsCompleted: swaps.totalSessionsCompleted,
      totalTeachingMinutesA: swaps.totalTeachingMinutesA,
      totalTeachingMinutesB: swaps.totalTeachingMinutesB,
      createdAt: swaps.createdAt,
      completedAt: swaps.completedAt,
    })
    .from(swaps)
    .where(
      and(
        eq(swaps.id, swapId),
        or(eq(swaps.userAId, userId), eq(swaps.userBId, userId))
      )
    )
    .limit(1);

  if (!swap) return null;

  // Get skills
  const [swapData] = await db
    .select({
      userATeachingSkillId: swaps.userATeachingSkillId,
      userBTeachingSkillId: swaps.userBTeachingSkillId,
    })
    .from(swaps)
    .where(eq(swaps.id, swapId))
    .limit(1);

  const [skillA] = await db
    .select({ id: skills.id, name: skills.name })
    .from(skills)
    .where(eq(skills.id, swapData.userATeachingSkillId))
    .limit(1);

  const [skillB] = await db
    .select({ id: skills.id, name: skills.name })
    .from(skills)
    .where(eq(skills.id, swapData.userBTeachingSkillId))
    .limit(1);

  // Get user profiles
  const [userAProfile] = await db
    .select({
      username: profiles.username,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(profiles)
    .where(eq(profiles.userId, swap.userAId))
    .limit(1);

  const [userBProfile] = await db
    .select({
      username: profiles.username,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(profiles)
    .where(eq(profiles.userId, swap.userBId))
    .limit(1);

  // Get conversation
  const [conversation] = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(eq(conversations.swapId, swapId))
    .limit(1);

  return {
    ...swap,
    userA: { id: swap.userAId, ...userAProfile, teachingSkill: skillA },
    userB: { id: swap.userBId, ...userBProfile, teachingSkill: skillB },
    conversationId: conversation?.id,
  };
}

export async function getUserSwaps(
  userId: string,
  status?: "active" | "paused" | "completed" | "cancelled"
) {
  let whereClause = or(eq(swaps.userAId, userId), eq(swaps.userBId, userId));

  if (status) {
    whereClause = and(whereClause, eq(swaps.status, status));
  }

  const swapList = await db
    .select({
      id: swaps.id,
      userAId: swaps.userAId,
      userBId: swaps.userBId,
      status: swaps.status,
      totalSessionsCompleted: swaps.totalSessionsCompleted,
      createdAt: swaps.createdAt,
    })
    .from(swaps)
    .where(whereClause)
    .orderBy(desc(swaps.createdAt));

  // Enrich with partner info and skills
  const enrichedSwaps = await Promise.all(
    swapList.map(async (swap) => {
      const partnerId = swap.userAId === userId ? swap.userBId : swap.userAId;

      const [partnerProfile] = await db
        .select({
          username: profiles.username,
          displayName: profiles.displayName,
          avatarUrl: profiles.avatarUrl,
        })
        .from(profiles)
        .where(eq(profiles.userId, partnerId))
        .limit(1);

      // Get the skill user is teaching in this swap
      const isUserA = swap.userAId === userId;

      const [swapSkills] = await db
        .select({
          userATeachingSkillId: swaps.userATeachingSkillId,
          userBTeachingSkillId: swaps.userBTeachingSkillId,
        })
        .from(swaps)
        .where(eq(swaps.id, swap.id))
        .limit(1);

      const teachingSkillId = isUserA
        ? swapSkills.userATeachingSkillId
        : swapSkills.userBTeachingSkillId;
      const learningSkillId = isUserA
        ? swapSkills.userBTeachingSkillId
        : swapSkills.userATeachingSkillId;

      const [teachingSkill] = await db
        .select({ id: skills.id, name: skills.name })
        .from(skills)
        .where(eq(skills.id, teachingSkillId))
        .limit(1);

      const [learningSkill] = await db
        .select({ id: skills.id, name: skills.name })
        .from(skills)
        .where(eq(skills.id, learningSkillId))
        .limit(1);

      return {
        ...swap,
        partner: { id: partnerId, ...partnerProfile },
        teachingSkill,
        learningSkill,
      };
    })
  );

  return enrichedSwaps;
}

export async function pauseSwap(swapId: string, userId: string) {
  const [swap] = await db
    .select()
    .from(swaps)
    .where(
      and(
        eq(swaps.id, swapId),
        or(eq(swaps.userAId, userId), eq(swaps.userBId, userId)),
        eq(swaps.status, "active")
      )
    )
    .limit(1);

  if (!swap) {
    throw new Error("Swap not found or cannot be paused");
  }

  await db
    .update(swaps)
    .set({ status: "paused", updatedAt: new Date() })
    .where(eq(swaps.id, swapId));

  const partnerId = swap.userAId === userId ? swap.userBId : swap.userAId;

  const [userProfile] = await db
    .select({ displayName: profiles.displayName })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  await db.insert(notifications).values({
    userId: partnerId,
    type: "session_cancelled",
    title: "Swap Paused",
    message: `${userProfile?.displayName || "Your partner"} has paused the skill swap.`,
    data: { swapId },
  });

  return true;
}

export async function resumeSwap(swapId: string, userId: string) {
  const [swap] = await db
    .select()
    .from(swaps)
    .where(
      and(
        eq(swaps.id, swapId),
        or(eq(swaps.userAId, userId), eq(swaps.userBId, userId)),
        eq(swaps.status, "paused")
      )
    )
    .limit(1);

  if (!swap) {
    throw new Error("Swap not found or cannot be resumed");
  }

  await db
    .update(swaps)
    .set({ status: "active", updatedAt: new Date() })
    .where(eq(swaps.id, swapId));

  return true;
}

export async function completeSwap(swapId: string, userId: string) {
  const [swap] = await db
    .select()
    .from(swaps)
    .where(
      and(
        eq(swaps.id, swapId),
        or(eq(swaps.userAId, userId), eq(swaps.userBId, userId)),
        eq(swaps.status, "active")
      )
    )
    .limit(1);

  if (!swap) {
    throw new Error("Swap not found or cannot be completed");
  }

  await db
    .update(swaps)
    .set({
      status: "completed",
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(swaps.id, swapId));

  const partnerId = swap.userAId === userId ? swap.userBId : swap.userAId;

  const [userProfile] = await db
    .select({ displayName: profiles.displayName })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  await db.insert(notifications).values({
    userId: partnerId,
    type: "session_completed",
    title: "Swap Completed",
    message: `${userProfile?.displayName || "Your partner"} marked the skill swap as complete!`,
    data: { swapId },
  });

  return true;
}

export async function cancelSwap(swapId: string, userId: string) {
  const [swap] = await db
    .select()
    .from(swaps)
    .where(
      and(
        eq(swaps.id, swapId),
        or(eq(swaps.userAId, userId), eq(swaps.userBId, userId)),
        or(eq(swaps.status, "active"), eq(swaps.status, "paused"))
      )
    )
    .limit(1);

  if (!swap) {
    throw new Error("Swap not found or cannot be cancelled");
  }

  await db
    .update(swaps)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(swaps.id, swapId));

  const partnerId = swap.userAId === userId ? swap.userBId : swap.userAId;

  const [userProfile] = await db
    .select({ displayName: profiles.displayName })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  await db.insert(notifications).values({
    userId: partnerId,
    type: "session_cancelled",
    title: "Swap Cancelled",
    message: `${userProfile?.displayName || "Your partner"} has cancelled the skill swap.`,
    data: { swapId },
  });

  return true;
}

export async function getActiveSwapCount(userId: string) {
  const result = await db
    .select({ id: swaps.id })
    .from(swaps)
    .where(
      and(
        or(eq(swaps.userAId, userId), eq(swaps.userBId, userId)),
        eq(swaps.status, "active")
      )
    );

  return result.length;
}

export async function getSwapStatistics(userId: string) {
  const allSwaps = await db
    .select({
      status: swaps.status,
      totalSessionsCompleted: swaps.totalSessionsCompleted,
      totalTeachingMinutesA: swaps.totalTeachingMinutesA,
      totalTeachingMinutesB: swaps.totalTeachingMinutesB,
      userAId: swaps.userAId,
    })
    .from(swaps)
    .where(or(eq(swaps.userAId, userId), eq(swaps.userBId, userId)));

  let totalTeachingMinutes = 0;
  let totalLearningMinutes = 0;
  let totalSessions = 0;
  let activeSwaps = 0;
  let completedSwaps = 0;

  for (const swap of allSwaps) {
    const isUserA = swap.userAId === userId;
    totalTeachingMinutes += isUserA
      ? (swap.totalTeachingMinutesA || 0)
      : (swap.totalTeachingMinutesB || 0);
    totalLearningMinutes += isUserA
      ? (swap.totalTeachingMinutesB || 0)
      : (swap.totalTeachingMinutesA || 0);
    totalSessions += swap.totalSessionsCompleted || 0;

    if (swap.status === "active") activeSwaps++;
    if (swap.status === "completed") completedSwaps++;
  }

  return {
    totalSwaps: allSwaps.length,
    activeSwaps,
    completedSwaps,
    totalSessions,
    totalTeachingHours: Math.round(totalTeachingMinutes / 60 * 10) / 10,
    totalLearningHours: Math.round(totalLearningMinutes / 60 * 10) / 10,
  };
}

