"use server";

import { requireAuth } from "@/lib/api/auth";
import {
  createSwapRequest,
  getSwapRequest,
  getUserRequests,
  acceptRequest,
  declineRequest,
  cancelRequest,
} from "@/lib/services/requests";
import {
  getSwap,
  getUserSwaps,
  pauseSwap,
  resumeSwap,
  completeSwap,
  cancelSwap,
} from "@/lib/services/swaps";
import { createSwapRequestSchema } from "@/lib/api/validations";
import { revalidatePath } from "next/cache";

export async function sendSwapRequest(formData: FormData) {
  const session = await requireAuth();

  const rawData = {
    recipientId: formData.get("recipientId") as string,
    teachingSkillId: formData.get("teachingSkillId") as string,
    learningSkillId: formData.get("learningSkillId") as string,
    proposedDuration: formData.get("proposedDuration")
      ? parseInt(formData.get("proposedDuration") as string)
      : undefined,
    proposedSchedule: formData.get("proposedSchedule") as string || undefined,
    message: formData.get("message") as string || undefined,
  };

  const validation = createSwapRequestSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return { error: firstError?.message || "Invalid input" };
  }

  try {
    const request = await createSwapRequest(session.user.id, validation.data);
    revalidatePath("/dashboard");
    revalidatePath("/requests");
    return { success: true, request };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to send request",
    };
  }
}

export async function getRequestDetails(requestId: string) {
  const session = await requireAuth();
  return getSwapRequest(requestId, session.user.id);
}

export async function getMyRequests(
  type: "sent" | "received" | "all" = "all",
  status?: "pending" | "accepted" | "declined" | "cancelled" | "expired"
) {
  const session = await requireAuth();
  return getUserRequests(session.user.id, type, status);
}

export async function acceptSwapRequest(requestId: string) {
  const session = await requireAuth();

  try {
    const result = await acceptRequest(requestId, session.user.id);
    revalidatePath("/dashboard");
    revalidatePath("/requests");
    revalidatePath("/swaps");
    return { success: true, swap: result.swap };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to accept request",
    };
  }
}

export async function declineSwapRequest(requestId: string) {
  const session = await requireAuth();

  try {
    await declineRequest(requestId, session.user.id);
    revalidatePath("/dashboard");
    revalidatePath("/requests");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to decline request",
    };
  }
}

export async function cancelSwapRequest(requestId: string) {
  const session = await requireAuth();

  try {
    await cancelRequest(requestId, session.user.id);
    revalidatePath("/dashboard");
    revalidatePath("/requests");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to cancel request",
    };
  }
}

export async function getSwapDetails(swapId: string) {
  const session = await requireAuth();
  return getSwap(swapId, session.user.id);
}

export async function getMySwaps(
  status?: "active" | "paused" | "completed" | "cancelled"
) {
  const session = await requireAuth();
  return getUserSwaps(session.user.id, status);
}

export async function pauseSwapAction(swapId: string) {
  const session = await requireAuth();

  try {
    await pauseSwap(swapId, session.user.id);
    revalidatePath("/dashboard");
    revalidatePath("/swaps");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to pause swap",
    };
  }
}

export async function resumeSwapAction(swapId: string) {
  const session = await requireAuth();

  try {
    await resumeSwap(swapId, session.user.id);
    revalidatePath("/dashboard");
    revalidatePath("/swaps");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to resume swap",
    };
  }
}

export async function completeSwapAction(swapId: string) {
  const session = await requireAuth();

  try {
    await completeSwap(swapId, session.user.id);
    revalidatePath("/dashboard");
    revalidatePath("/swaps");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to complete swap",
    };
  }
}

export async function cancelSwapAction(swapId: string) {
  const session = await requireAuth();

  try {
    await cancelSwap(swapId, session.user.id);
    revalidatePath("/dashboard");
    revalidatePath("/swaps");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to cancel swap",
    };
  }
}

