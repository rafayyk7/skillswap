import { db } from "@/db";
import {
  reviews,
  learningSessions,
  swaps,
  profiles,
  notifications,
} from "@/db/schema";
import { eq, and, or, desc, sql } from "drizzle-orm";
import type { CreateReviewInput } from "@/lib/api/validations";

export async function createReview(userId: string, input: CreateReviewInput) {
  const {
    sessionId,
    swapId,
    revieweeId,
    teachingQuality,
    communication,
    knowledge,
    punctuality,
    comment,
  } = input;

  // Cannot review yourself
  if (userId === revieweeId) {
    throw new Error("Cannot review yourself");
  }

  // Must have either sessionId or swapId
  if (!sessionId && !swapId) {
    throw new Error("Must provide either sessionId or swapId");
  }

  // Verify the session/swap exists and involves both users
  if (sessionId) {
    const [session] = await db
      .select()
      .from(learningSessions)
      .where(
        and(
          eq(learningSessions.id, sessionId),
          eq(learningSessions.status, "completed"),
          or(
            and(
              eq(learningSessions.teacherId, userId),
              eq(learningSessions.learnerId, revieweeId)
            ),
            and(
              eq(learningSessions.learnerId, userId),
              eq(learningSessions.teacherId, revieweeId)
            )
          )
        )
      )
      .limit(1);

    if (!session) {
      throw new Error(
        "Session not found, not completed, or you are not a participant"
      );
    }

    // Check if already reviewed this session
    const [existingReview] = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(
        and(
          eq(reviews.sessionId, sessionId),
          eq(reviews.reviewerId, userId)
        )
      )
      .limit(1);

    if (existingReview) {
      throw new Error("You have already reviewed this session");
    }
  }

  if (swapId && !sessionId) {
    const [swap] = await db
      .select()
      .from(swaps)
      .where(
        and(
          eq(swaps.id, swapId),
          or(
            and(eq(swaps.userAId, userId), eq(swaps.userBId, revieweeId)),
            and(eq(swaps.userBId, userId), eq(swaps.userAId, revieweeId))
          )
        )
      )
      .limit(1);

    if (!swap) {
      throw new Error("Swap not found or you are not a participant");
    }
  }

  // Calculate overall rating
  const overallRating =
    (teachingQuality + communication + knowledge + punctuality) / 4;

  // Get reviewer profile for notification
  const [reviewerProfile] = await db
    .select({ displayName: profiles.displayName })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  const [review] = await db.transaction(async (tx) => {
    const [newReview] = await tx
      .insert(reviews)
      .values({
        reviewerId: userId,
        revieweeId,
        sessionId,
        swapId,
        teachingQuality,
        communication,
        knowledge,
        punctuality,
        overallRating: overallRating.toFixed(1),
        comment,
      })
      .returning();

    // Notify reviewee
    await tx.insert(notifications).values({
      userId: revieweeId,
      type: "review_received",
      title: "New Review Received",
      message: `${reviewerProfile?.displayName || "Someone"} left you a ${overallRating.toFixed(1)}-star review!`,
      data: { reviewId: newReview.id },
    });

    return [newReview];
  });

  return review;
}

export async function getUserReviews(
  userId: string,
  type: "received" | "given" = "received",
  options: { limit?: number; offset?: number } = {}
) {
  const { limit = 20, offset = 0 } = options;

  const whereClause =
    type === "received"
      ? eq(reviews.revieweeId, userId)
      : eq(reviews.reviewerId, userId);

  const reviewList = await db
    .select({
      id: reviews.id,
      reviewerId: reviews.reviewerId,
      revieweeId: reviews.revieweeId,
      sessionId: reviews.sessionId,
      swapId: reviews.swapId,
      teachingQuality: reviews.teachingQuality,
      communication: reviews.communication,
      knowledge: reviews.knowledge,
      punctuality: reviews.punctuality,
      overallRating: reviews.overallRating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .where(whereClause)
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .offset(offset);

  // Enrich with user profiles
  const enrichedReviews = await Promise.all(
    reviewList.map(async (review) => {
      const otherId =
        type === "received" ? review.reviewerId : review.revieweeId;

      const [profile] = await db
        .select({
          username: profiles.username,
          displayName: profiles.displayName,
          avatarUrl: profiles.avatarUrl,
        })
        .from(profiles)
        .where(eq(profiles.userId, otherId))
        .limit(1);

      return {
        ...review,
        [type === "received" ? "reviewer" : "reviewee"]: {
          id: otherId,
          ...profile,
        },
      };
    })
  );

  return enrichedReviews;
}

export async function getReview(reviewId: string) {
  const [review] = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, reviewId))
    .limit(1);

  if (!review) return null;

  const [reviewerProfile] = await db
    .select({
      username: profiles.username,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(profiles)
    .where(eq(profiles.userId, review.reviewerId))
    .limit(1);

  const [revieweeProfile] = await db
    .select({
      username: profiles.username,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(profiles)
    .where(eq(profiles.userId, review.revieweeId))
    .limit(1);

  return {
    ...review,
    reviewer: { id: review.reviewerId, ...reviewerProfile },
    reviewee: { id: review.revieweeId, ...revieweeProfile },
  };
}

export async function getUserRating(userId: string) {
  const userReviews = await db
    .select({
      teachingQuality: reviews.teachingQuality,
      communication: reviews.communication,
      knowledge: reviews.knowledge,
      punctuality: reviews.punctuality,
      overallRating: reviews.overallRating,
    })
    .from(reviews)
    .where(eq(reviews.revieweeId, userId));

  if (userReviews.length === 0) {
    return {
      averageRating: null,
      totalReviews: 0,
      breakdown: {
        teachingQuality: null,
        communication: null,
        knowledge: null,
        punctuality: null,
      },
    };
  }

  const avgTeaching =
    userReviews.reduce((sum, r) => sum + r.teachingQuality, 0) /
    userReviews.length;
  const avgCommunication =
    userReviews.reduce((sum, r) => sum + r.communication, 0) /
    userReviews.length;
  const avgKnowledge =
    userReviews.reduce((sum, r) => sum + r.knowledge, 0) / userReviews.length;
  const avgPunctuality =
    userReviews.reduce((sum, r) => sum + r.punctuality, 0) / userReviews.length;
  const avgOverall =
    userReviews.reduce((sum, r) => sum + Number(r.overallRating), 0) /
    userReviews.length;

  return {
    averageRating: Math.round(avgOverall * 10) / 10,
    totalReviews: userReviews.length,
    breakdown: {
      teachingQuality: Math.round(avgTeaching * 10) / 10,
      communication: Math.round(avgCommunication * 10) / 10,
      knowledge: Math.round(avgKnowledge * 10) / 10,
      punctuality: Math.round(avgPunctuality * 10) / 10,
    },
  };
}

export async function canReviewSession(userId: string, sessionId: string) {
  // Check if session exists and user is participant
  const [session] = await db
    .select()
    .from(learningSessions)
    .where(
      and(
        eq(learningSessions.id, sessionId),
        eq(learningSessions.status, "completed"),
        or(
          eq(learningSessions.teacherId, userId),
          eq(learningSessions.learnerId, userId)
        )
      )
    )
    .limit(1);

  if (!session) return false;

  // Check if already reviewed
  const [existingReview] = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(
      and(eq(reviews.sessionId, sessionId), eq(reviews.reviewerId, userId))
    )
    .limit(1);

  return !existingReview;
}

