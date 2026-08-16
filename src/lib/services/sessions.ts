import { db } from "@/db";
import {
  learningSessions,
  sessionNotes,
  swaps,
  users,
  profiles,
  skills,
  notifications,
} from "@/db/schema";
import { eq, and, or, desc, gt, lt, gte, lte, sql } from "drizzle-orm";
import type { CreateSessionInput, UpdateSessionInput } from "@/lib/api/validations";

export async function createSession(
  userId: string,
  input: CreateSessionInput
) {
  const {
    swapId,
    teacherId,
    learnerId,
    skillId,
    scheduledAt,
    duration,
    timezone,
    meetingUrl,
    objective,
  } = input;

  // Validate swap exists and user is part of it
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
    throw new Error("Swap not found or not active");
  }

  // Validate scheduled time is in the future
  const scheduledDate = new Date(scheduledAt);
  if (scheduledDate <= new Date()) {
    throw new Error("Cannot schedule sessions in the past");
  }

  // Check for overlapping sessions
  const endTime = new Date(scheduledDate.getTime() + duration * 60000);
  
  const overlapping = await db
    .select({ id: learningSessions.id })
    .from(learningSessions)
    .where(
      and(
        or(
          eq(learningSessions.teacherId, teacherId),
          eq(learningSessions.learnerId, teacherId),
          eq(learningSessions.teacherId, learnerId),
          eq(learningSessions.learnerId, learnerId)
        ),
        eq(learningSessions.status, "scheduled"),
        lt(learningSessions.scheduledAt, endTime),
        gt(
          sql`${learningSessions.scheduledAt} + (${learningSessions.duration} || ' minutes')::interval`,
          scheduledDate
        )
      )
    )
    .limit(1);

  if (overlapping.length > 0) {
    throw new Error("This time slot conflicts with another session");
  }

  // Create session
  const [session] = await db
    .insert(learningSessions)
    .values({
      swapId,
      teacherId,
      learnerId,
      skillId,
      scheduledAt: scheduledDate,
      duration,
      timezone: timezone || "UTC",
      meetingUrl,
      objective,
      status: "scheduled",
    })
    .returning();

  // Notify both participants
  const [teacherProfile] = await db
    .select({ displayName: profiles.displayName })
    .from(profiles)
    .where(eq(profiles.userId, teacherId))
    .limit(1);

  const [skillData] = await db
    .select({ name: skills.name })
    .from(skills)
    .where(eq(skills.id, skillId))
    .limit(1);

  await db.insert(notifications).values([
    {
      userId: teacherId,
      type: "session_created",
      title: "New Session Scheduled",
      message: `You have a new ${skillData?.name || "skill"} teaching session scheduled.`,
      data: { sessionId: session.id, swapId },
    },
    {
      userId: learnerId,
      type: "session_created",
      title: "New Session Scheduled",
      message: `${teacherProfile?.displayName || "Your partner"} scheduled a ${skillData?.name || "skill"} session with you.`,
      data: { sessionId: session.id, swapId },
    },
  ]);

  return session;
}

export async function getSession(sessionId: string, userId: string) {
  const [session] = await db
    .select({
      id: learningSessions.id,
      swapId: learningSessions.swapId,
      teacherId: learningSessions.teacherId,
      learnerId: learningSessions.learnerId,
      skillId: learningSessions.skillId,
      scheduledAt: learningSessions.scheduledAt,
      duration: learningSessions.duration,
      timezone: learningSessions.timezone,
      meetingUrl: learningSessions.meetingUrl,
      objective: learningSessions.objective,
      notes: learningSessions.notes,
      status: learningSessions.status,
      completedAt: learningSessions.completedAt,
      createdAt: learningSessions.createdAt,
    })
    .from(learningSessions)
    .where(
      and(
        eq(learningSessions.id, sessionId),
        or(
          eq(learningSessions.teacherId, userId),
          eq(learningSessions.learnerId, userId)
        )
      )
    )
    .limit(1);

  if (!session) return null;

  // Get teacher and learner profiles
  const [teacherProfile] = await db
    .select({
      username: profiles.username,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(profiles)
    .where(eq(profiles.userId, session.teacherId))
    .limit(1);

  const [learnerProfile] = await db
    .select({
      username: profiles.username,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(profiles)
    .where(eq(profiles.userId, session.learnerId))
    .limit(1);

  const [skill] = await db
    .select({ id: skills.id, name: skills.name })
    .from(skills)
    .where(eq(skills.id, session.skillId))
    .limit(1);

  // Get session notes
  const notes = await db
    .select()
    .from(sessionNotes)
    .where(eq(sessionNotes.sessionId, sessionId))
    .orderBy(desc(sessionNotes.createdAt));

  return {
    ...session,
    teacher: { id: session.teacherId, ...teacherProfile },
    learner: { id: session.learnerId, ...learnerProfile },
    skill,
    sessionNotes: notes.filter((n) => !n.isPrivate || n.userId === userId),
  };
}

export async function getUserSessions(
  userId: string,
  options: {
    status?: "scheduled" | "in_progress" | "completed" | "cancelled";
    upcoming?: boolean;
    past?: boolean;
    limit?: number;
    offset?: number;
  } = {}
) {
  const { status, upcoming, past, limit = 20, offset = 0 } = options;

  let whereClause = or(
    eq(learningSessions.teacherId, userId),
    eq(learningSessions.learnerId, userId)
  );

  if (status) {
    whereClause = and(whereClause, eq(learningSessions.status, status));
  }

  if (upcoming) {
    whereClause = and(
      whereClause,
      gt(learningSessions.scheduledAt, new Date()),
      eq(learningSessions.status, "scheduled")
    );
  }

  if (past) {
    whereClause = and(
      whereClause,
      lt(learningSessions.scheduledAt, new Date())
    );
  }

  const sessions = await db
    .select({
      id: learningSessions.id,
      swapId: learningSessions.swapId,
      teacherId: learningSessions.teacherId,
      learnerId: learningSessions.learnerId,
      skillId: learningSessions.skillId,
      scheduledAt: learningSessions.scheduledAt,
      duration: learningSessions.duration,
      status: learningSessions.status,
      meetingUrl: learningSessions.meetingUrl,
      objective: learningSessions.objective,
    })
    .from(learningSessions)
    .where(whereClause)
    .orderBy(
      upcoming
        ? learningSessions.scheduledAt
        : desc(learningSessions.scheduledAt)
    )
    .limit(limit)
    .offset(offset);

  // Enrich with profiles and skills
  const enrichedSessions = await Promise.all(
    sessions.map(async (session) => {
      const partnerId =
        session.teacherId === userId ? session.learnerId : session.teacherId;
      const isTeacher = session.teacherId === userId;

      const [partnerProfile] = await db
        .select({
          username: profiles.username,
          displayName: profiles.displayName,
          avatarUrl: profiles.avatarUrl,
        })
        .from(profiles)
        .where(eq(profiles.userId, partnerId))
        .limit(1);

      const [skill] = await db
        .select({ id: skills.id, name: skills.name })
        .from(skills)
        .where(eq(skills.id, session.skillId))
        .limit(1);

      return {
        ...session,
        partner: { id: partnerId, ...partnerProfile },
        skill,
        isTeacher,
      };
    })
  );

  return enrichedSessions;
}

export async function updateSession(
  sessionId: string,
  userId: string,
  input: UpdateSessionInput
) {
  const [session] = await db
    .select()
    .from(learningSessions)
    .where(
      and(
        eq(learningSessions.id, sessionId),
        or(
          eq(learningSessions.teacherId, userId),
          eq(learningSessions.learnerId, userId)
        )
      )
    )
    .limit(1);

  if (!session) {
    throw new Error("Session not found");
  }

  if (session.status === "completed" || session.status === "cancelled") {
    throw new Error("Cannot update a completed or cancelled session");
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if (input.scheduledAt) {
    const newDate = new Date(input.scheduledAt);
    if (newDate <= new Date()) {
      throw new Error("Cannot reschedule to a past time");
    }
    updateData.scheduledAt = newDate;
  }

  if (input.duration) updateData.duration = input.duration;
  if (input.meetingUrl !== undefined) updateData.meetingUrl = input.meetingUrl;
  if (input.objective !== undefined) updateData.objective = input.objective;
  if (input.notes !== undefined) updateData.notes = input.notes;

  const [updated] = await db
    .update(learningSessions)
    .set(updateData)
    .where(eq(learningSessions.id, sessionId))
    .returning();

  // Notify partner if rescheduled
  if (input.scheduledAt) {
    const partnerId =
      session.teacherId === userId ? session.learnerId : session.teacherId;

    const [userProfile] = await db
      .select({ displayName: profiles.displayName })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    await db.insert(notifications).values({
      userId: partnerId,
      type: "session_rescheduled",
      title: "Session Rescheduled",
      message: `${userProfile?.displayName || "Your partner"} rescheduled your session.`,
      data: { sessionId },
    });
  }

  return updated;
}

export async function cancelSession(
  sessionId: string,
  userId: string,
  reason?: string
) {
  const [session] = await db
    .select()
    .from(learningSessions)
    .where(
      and(
        eq(learningSessions.id, sessionId),
        or(
          eq(learningSessions.teacherId, userId),
          eq(learningSessions.learnerId, userId)
        ),
        eq(learningSessions.status, "scheduled")
      )
    )
    .limit(1);

  if (!session) {
    throw new Error("Session not found or cannot be cancelled");
  }

  await db
    .update(learningSessions)
    .set({
      status: "cancelled",
      cancelledAt: new Date(),
      cancelReason: reason,
      updatedAt: new Date(),
    })
    .where(eq(learningSessions.id, sessionId));

  const partnerId =
    session.teacherId === userId ? session.learnerId : session.teacherId;

  const [userProfile] = await db
    .select({ displayName: profiles.displayName })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  await db.insert(notifications).values({
    userId: partnerId,
    type: "session_cancelled",
    title: "Session Cancelled",
    message: `${userProfile?.displayName || "Your partner"} cancelled the session.${reason ? ` Reason: ${reason}` : ""}`,
    data: { sessionId },
  });

  return true;
}

export async function completeSession(
  sessionId: string,
  userId: string,
  notes?: string
) {
  const [session] = await db
    .select()
    .from(learningSessions)
    .where(
      and(
        eq(learningSessions.id, sessionId),
        or(
          eq(learningSessions.teacherId, userId),
          eq(learningSessions.learnerId, userId)
        ),
        or(
          eq(learningSessions.status, "scheduled"),
          eq(learningSessions.status, "in_progress")
        )
      )
    )
    .limit(1);

  if (!session) {
    throw new Error("Session not found or cannot be completed");
  }

  await db.transaction(async (tx) => {
    await tx
      .update(learningSessions)
      .set({
        status: "completed",
        completedAt: new Date(),
        notes: notes || session.notes,
        updatedAt: new Date(),
      })
      .where(eq(learningSessions.id, sessionId));

    // Update swap statistics
    const [swap] = await tx
      .select()
      .from(swaps)
      .where(eq(swaps.id, session.swapId))
      .limit(1);

    if (swap) {
      const isTeacherA = session.teacherId === swap.userAId;

      await tx
        .update(swaps)
        .set({
          totalSessionsCompleted: (swap.totalSessionsCompleted || 0) + 1,
          totalTeachingMinutesA: isTeacherA
            ? (swap.totalTeachingMinutesA || 0) + session.duration
            : swap.totalTeachingMinutesA,
          totalTeachingMinutesB: !isTeacherA
            ? (swap.totalTeachingMinutesB || 0) + session.duration
            : swap.totalTeachingMinutesB,
          updatedAt: new Date(),
        })
        .where(eq(swaps.id, session.swapId));
    }

    // Notify both participants
    const partnerId =
      session.teacherId === userId ? session.learnerId : session.teacherId;

    const [userProfile] = await tx
      .select({ displayName: profiles.displayName })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    await tx.insert(notifications).values({
      userId: partnerId,
      type: "session_completed",
      title: "Session Completed",
      message: `${userProfile?.displayName || "Your partner"} marked the session as complete. Don't forget to leave a review!`,
      data: { sessionId, swapId: session.swapId },
    });
  });

  return true;
}

export async function addSessionNote(
  sessionId: string,
  userId: string,
  content: string,
  isPrivate = false
) {
  // Verify user is part of session
  const [session] = await db
    .select({ id: learningSessions.id })
    .from(learningSessions)
    .where(
      and(
        eq(learningSessions.id, sessionId),
        or(
          eq(learningSessions.teacherId, userId),
          eq(learningSessions.learnerId, userId)
        )
      )
    )
    .limit(1);

  if (!session) {
    throw new Error("Session not found");
  }

  const [note] = await db
    .insert(sessionNotes)
    .values({
      sessionId,
      userId,
      content,
      isPrivate,
    })
    .returning();

  return note;
}

export async function getUpcomingSessionsCount(userId: string) {
  const result = await db
    .select({ id: learningSessions.id })
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
    );

  return result.length;
}

