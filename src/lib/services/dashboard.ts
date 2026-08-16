import { db } from "@/db";
import {
  users,
  profiles,
  swapRequests,
  swaps,
  learningSessions,
  notifications,
  reviews,
} from "@/db/schema";
import { eq, and, or, desc, gt, sql, isNull } from "drizzle-orm";
import { getSuggestedMatches } from "./matching";
import { getSwapStatistics } from "./swaps";
import { getUnreadMessageCount } from "./messaging";

export async function getDashboardData(userId: string) {
  // Get user profile
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      emailVerified: users.emailVerified,
      status: users.status,
      profile: {
        username: profiles.username,
        displayName: profiles.displayName,
        avatarUrl: profiles.avatarUrl,
        bio: profiles.bio,
        country: profiles.country,
        timezone: profiles.timezone,
      },
    })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new Error("User not found");
  }

  // Get upcoming sessions
  const upcomingSessions = await db
    .select({
      id: learningSessions.id,
      scheduledAt: learningSessions.scheduledAt,
      duration: learningSessions.duration,
      teacherId: learningSessions.teacherId,
      learnerId: learningSessions.learnerId,
      skillId: learningSessions.skillId,
      meetingUrl: learningSessions.meetingUrl,
      objective: learningSessions.objective,
    })
    .from(learningSessions)
    .where(
      and(
        or(
          eq(learningSessions.teacherId, userId),
          eq(learningSessions.learnerId, userId)
        ),
        eq(learningSessions.status, "scheduled"),
        gt(learningSessions.scheduledAt, new Date())
      )
    )
    .orderBy(learningSessions.scheduledAt)
    .limit(5);

  // Get pending requests
  const pendingRequests = await db
    .select({
      id: swapRequests.id,
      requesterId: swapRequests.requesterId,
      recipientId: swapRequests.recipientId,
      message: swapRequests.message,
      createdAt: swapRequests.createdAt,
    })
    .from(swapRequests)
    .where(
      and(
        eq(swapRequests.recipientId, userId),
        eq(swapRequests.status, "pending")
      )
    )
    .orderBy(desc(swapRequests.createdAt))
    .limit(5);

  // Get active swaps
  const activeSwaps = await db
    .select({
      id: swaps.id,
      userAId: swaps.userAId,
      userBId: swaps.userBId,
      totalSessionsCompleted: swaps.totalSessionsCompleted,
      createdAt: swaps.createdAt,
    })
    .from(swaps)
    .where(
      and(
        or(eq(swaps.userAId, userId), eq(swaps.userBId, userId)),
        eq(swaps.status, "active")
      )
    )
    .orderBy(desc(swaps.createdAt))
    .limit(5);

  // Get unread notifications count
  const unreadNotifications = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(
      and(eq(notifications.userId, userId), isNull(notifications.readAt))
    );

  // Get recent notifications
  const recentNotifications = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(5);

  // Get swap statistics
  const stats = await getSwapStatistics(userId);

  // Get unread message count
  const unreadMessages = await getUnreadMessageCount(userId);

  // Get suggested matches
  const suggestedMatches = await getSuggestedMatches(userId, 3);

  // Get recent reviews received
  const recentReviews = await db
    .select({
      id: reviews.id,
      overallRating: reviews.overallRating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      reviewerId: reviews.reviewerId,
    })
    .from(reviews)
    .where(eq(reviews.revieweeId, userId))
    .orderBy(desc(reviews.createdAt))
    .limit(3);

  // Enrich recent reviews with reviewer info
  const enrichedReviews = await Promise.all(
    recentReviews.map(async (review) => {
      const [reviewer] = await db
        .select({
          username: profiles.username,
          displayName: profiles.displayName,
          avatarUrl: profiles.avatarUrl,
        })
        .from(profiles)
        .where(eq(profiles.userId, review.reviewerId))
        .limit(1);

      return {
        ...review,
        reviewer,
      };
    })
  );

  // Calculate average rating
  const allReviews = await db
    .select({ overallRating: reviews.overallRating })
    .from(reviews)
    .where(eq(reviews.revieweeId, userId));

  const averageRating =
    allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + Number(r.overallRating), 0) /
        allReviews.length
      : null;

  return {
    user,
    upcomingSessions,
    pendingRequests,
    pendingRequestsCount: pendingRequests.length,
    activeSwaps,
    activeSwapsCount: stats.activeSwaps,
    unreadNotificationsCount: unreadNotifications.length,
    recentNotifications,
    unreadMessagesCount: unreadMessages,
    stats: {
      ...stats,
      averageRating: averageRating ? Math.round(averageRating * 10) / 10 : null,
      totalReviews: allReviews.length,
    },
    suggestedMatches,
    recentReviews: enrichedReviews,
  };
}

export async function getAdminDashboardData() {
  // Total users
  const totalUsers = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.status, "active"));

  // Total swaps
  const totalSwaps = await db.select({ id: swaps.id }).from(swaps);

  // Active swaps
  const activeSwapsCount = await db
    .select({ id: swaps.id })
    .from(swaps)
    .where(eq(swaps.status, "active"));

  // Total sessions
  const totalSessions = await db
    .select({ id: learningSessions.id })
    .from(learningSessions);

  // Completed sessions
  const completedSessions = await db
    .select({ id: learningSessions.id })
    .from(learningSessions)
    .where(eq(learningSessions.status, "completed"));

  // Pending requests
  const pendingRequests = await db
    .select({ id: swapRequests.id })
    .from(swapRequests)
    .where(eq(swapRequests.status, "pending"));

  // Recent signups
  const recentSignups = await db
    .select({
      id: users.id,
      email: users.email,
      status: users.status,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(10);

  return {
    stats: {
      totalUsers: totalUsers.length,
      totalSwaps: totalSwaps.length,
      activeSwaps: activeSwapsCount.length,
      totalSessions: totalSessions.length,
      completedSessions: completedSessions.length,
      pendingRequests: pendingRequests.length,
    },
    recentSignups,
  };
}

