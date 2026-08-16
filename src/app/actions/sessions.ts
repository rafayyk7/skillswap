"use server";

import { requireAuth } from "@/lib/api/auth";
import {
  createSession,
  getSession,
  getUserSessions,
  updateSession,
  cancelSession,
  completeSession,
  addSessionNote,
} from "@/lib/services/sessions";
import {
  createSessionSchema,
  updateSessionSchema,
} from "@/lib/api/validations";
import { revalidatePath } from "next/cache";

export async function scheduleSession(formData: FormData) {
  const session = await requireAuth();

  const rawData = {
    swapId: formData.get("swapId") as string,
    teacherId: formData.get("teacherId") as string,
    learnerId: formData.get("learnerId") as string,
    skillId: formData.get("skillId") as string,
    scheduledAt: formData.get("scheduledAt") as string,
    duration: parseInt(formData.get("duration") as string),
    timezone: formData.get("timezone") as string || undefined,
    meetingUrl: formData.get("meetingUrl") as string || undefined,
    objective: formData.get("objective") as string || undefined,
  };

  const validation = createSessionSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return { error: firstError?.message || "Invalid input" };
  }

  try {
    const learningSession = await createSession(session.user.id, validation.data);
    revalidatePath("/dashboard");
    revalidatePath("/sessions");
    revalidatePath(`/swaps/${validation.data.swapId}`);
    return { success: true, session: learningSession };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to schedule session",
    };
  }
}

export async function getSessionDetails(sessionId: string) {
  const authSession = await requireAuth();
  return getSession(sessionId, authSession.user.id);
}

export async function getMySessions(options?: {
  status?: "scheduled" | "in_progress" | "completed" | "cancelled";
  upcoming?: boolean;
  past?: boolean;
  limit?: number;
  offset?: number;
}) {
  const session = await requireAuth();
  return getUserSessions(session.user.id, options);
}

export async function updateSessionAction(sessionId: string, formData: FormData) {
  const session = await requireAuth();

  const rawData: Record<string, unknown> = {};

  if (formData.get("scheduledAt")) {
    rawData.scheduledAt = formData.get("scheduledAt") as string;
  }
  if (formData.get("duration")) {
    rawData.duration = parseInt(formData.get("duration") as string);
  }
  if (formData.has("meetingUrl")) {
    rawData.meetingUrl = formData.get("meetingUrl") as string || null;
  }
  if (formData.has("objective")) {
    rawData.objective = formData.get("objective") as string || null;
  }
  if (formData.has("notes")) {
    rawData.notes = formData.get("notes") as string || null;
  }

  const validation = updateSessionSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return { error: firstError?.message || "Invalid input" };
  }

  try {
    const updatedSession = await updateSession(sessionId, session.user.id, validation.data);
    revalidatePath("/dashboard");
    revalidatePath("/sessions");
    revalidatePath(`/sessions/${sessionId}`);
    return { success: true, session: updatedSession };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update session",
    };
  }
}

export async function cancelSessionAction(sessionId: string, reason?: string) {
  const session = await requireAuth();

  try {
    await cancelSession(sessionId, session.user.id, reason);
    revalidatePath("/dashboard");
    revalidatePath("/sessions");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to cancel session",
    };
  }
}

export async function completeSessionAction(sessionId: string, notes?: string) {
  const session = await requireAuth();

  try {
    await completeSession(sessionId, session.user.id, notes);
    revalidatePath("/dashboard");
    revalidatePath("/sessions");
    revalidatePath(`/sessions/${sessionId}`);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to complete session",
    };
  }
}

export async function addSessionNoteAction(
  sessionId: string,
  content: string,
  isPrivate = false
) {
  const session = await requireAuth();

  try {
    const note = await addSessionNote(sessionId, session.user.id, content, isPrivate);
    revalidatePath(`/sessions/${sessionId}`);
    return { success: true, note };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to add note",
    };
  }
}

