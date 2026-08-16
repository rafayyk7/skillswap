"use server";

import { requireAuth } from "@/lib/api/auth";
import {
  createReview,
  getUserReviews,
  getUserRating,
  canReviewSession,
} from "@/lib/services/reviews";
import { createReviewSchema } from "@/lib/api/validations";
import { revalidatePath } from "next/cache";

export async function submitReview(formData: FormData) {
  const session = await requireAuth();

  const rawData = {
    sessionId: formData.get("sessionId") as string || undefined,
    swapId: formData.get("swapId") as string || undefined,
    revieweeId: formData.get("revieweeId") as string,
    teachingQuality: parseInt(formData.get("teachingQuality") as string),
    communication: parseInt(formData.get("communication") as string),
    knowledge: parseInt(formData.get("knowledge") as string),
    punctuality: parseInt(formData.get("punctuality") as string),
    comment: formData.get("comment") as string || undefined,
  };

  const validation = createReviewSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return { error: firstError?.message || "Invalid input" };
  }

  try {
    const review = await createReview(session.user.id, validation.data);
    revalidatePath("/dashboard");
    revalidatePath("/reviews");
    return { success: true, review };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to submit review",
    };
  }
}

export async function getMyReviews(
  type: "received" | "given" = "received",
  options?: { limit?: number; offset?: number }
) {
  const session = await requireAuth();
  return getUserReviews(session.user.id, type, options);
}

export async function getMyRating() {
  const session = await requireAuth();
  return getUserRating(session.user.id);
}

export async function checkCanReviewSession(sessionId: string) {
  const session = await requireAuth();
  return canReviewSession(session.user.id, sessionId);
}

