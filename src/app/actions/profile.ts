"use server";

import { requireAuth } from "@/lib/api/auth";
import {
  updateProfile,
  getFullUserProfile,
  addTeachingSkill,
  removeTeachingSkill,
  addLearningSkill,
  removeLearningSkill,
  addUserLanguage,
  removeUserLanguage,
  setAvailability,
  addPortfolioItem,
  removePortfolioItem,
} from "@/lib/services/users";
import {
  updateProfileSchema,
  addTeachingSkillSchema,
  addLearningSkillSchema,
  addUserLanguageSchema,
  addAvailabilitySchema,
  addPortfolioItemSchema,
} from "@/lib/api/validations";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: FormData) {
  const session = await requireAuth();

  const rawData = {
    displayName: formData.get("displayName") as string || undefined,
    username: formData.get("username") as string || undefined,
    bio: formData.get("bio") as string || undefined,
    country: formData.get("country") as string || undefined,
    timezone: formData.get("timezone") as string || undefined,
    experienceSummary: formData.get("experienceSummary") as string || undefined,
    avatarUrl: formData.get("avatarUrl") as string || undefined,
  };

  // Filter out undefined values
  const filteredData = Object.fromEntries(
    Object.entries(rawData).filter(([, v]) => v !== undefined && v !== "")
  );

  const validation = updateProfileSchema.safeParse(filteredData);

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return { error: firstError?.message || "Invalid input" };
  }

  try {
    const profile = await updateProfile(session.user.id, validation.data);
    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: true, profile };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

export async function getMyProfile() {
  const session = await requireAuth();
  return getFullUserProfile(session.user.id);
}

export async function addTeachingSkillAction(formData: FormData) {
  const session = await requireAuth();

  const rawData = {
    skillId: formData.get("skillId") as string,
    proficiency: formData.get("proficiency") as string,
    yearsExperience: formData.get("yearsExperience")
      ? parseInt(formData.get("yearsExperience") as string)
      : undefined,
    description: formData.get("description") as string || undefined,
  };

  const validation = addTeachingSkillSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return { error: firstError?.message || "Invalid input" };
  }

  try {
    const result = await addTeachingSkill(
      session.user.id,
      validation.data.skillId,
      validation.data.proficiency,
      validation.data.yearsExperience,
      validation.data.description
    );
    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: true, skill: result };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to add skill",
    };
  }
}

export async function removeTeachingSkillAction(skillId: string) {
  const session = await requireAuth();

  try {
    await removeTeachingSkill(session.user.id, skillId);
    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to remove skill",
    };
  }
}

export async function addLearningSkillAction(formData: FormData) {
  const session = await requireAuth();

  const rawData = {
    skillId: formData.get("skillId") as string,
    desiredLevel: formData.get("desiredLevel") as string,
    priority: formData.get("priority")
      ? parseInt(formData.get("priority") as string)
      : undefined,
    description: formData.get("description") as string || undefined,
  };

  const validation = addLearningSkillSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return { error: firstError?.message || "Invalid input" };
  }

  try {
    const result = await addLearningSkill(
      session.user.id,
      validation.data.skillId,
      validation.data.desiredLevel,
      validation.data.priority,
      validation.data.description
    );
    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: true, skill: result };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to add skill",
    };
  }
}

export async function removeLearningSkillAction(skillId: string) {
  const session = await requireAuth();

  try {
    await removeLearningSkill(session.user.id, skillId);
    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to remove skill",
    };
  }
}

export async function addLanguageAction(formData: FormData) {
  const session = await requireAuth();

  const rawData = {
    languageId: formData.get("languageId") as string,
    proficiency: formData.get("proficiency") as string,
  };

  const validation = addUserLanguageSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return { error: firstError?.message || "Invalid input" };
  }

  try {
    const result = await addUserLanguage(
      session.user.id,
      validation.data.languageId,
      validation.data.proficiency
    );
    revalidatePath("/profile");
    return { success: true, language: result };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to add language",
    };
  }
}

export async function removeLanguageAction(languageId: string) {
  const session = await requireAuth();

  try {
    await removeUserLanguage(session.user.id, languageId);
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to remove language",
    };
  }
}

export async function setAvailabilityAction(
  slots: Array<{
    dayOfWeek: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    startTime: string;
    endTime: string;
    timezone?: string;
  }>
) {
  const session = await requireAuth();

  // Validate each slot
  for (const slot of slots) {
    const validation = addAvailabilitySchema.safeParse(slot);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return { error: firstError?.message || "Invalid availability slot" };
    }
  }

  try {
    await setAvailability(session.user.id, slots);
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to set availability",
    };
  }
}

export async function addPortfolioItemAction(formData: FormData) {
  const session = await requireAuth();

  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string || undefined,
    url: formData.get("url") as string || undefined,
    imageUrl: formData.get("imageUrl") as string || undefined,
  };

  const validation = addPortfolioItemSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return { error: firstError?.message || "Invalid input" };
  }

  try {
    const result = await addPortfolioItem(
      session.user.id,
      validation.data.title,
      validation.data.description,
      validation.data.url || undefined,
      validation.data.imageUrl || undefined
    );
    revalidatePath("/profile");
    return { success: true, item: result };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to add portfolio item",
    };
  }
}

export async function removePortfolioItemAction(itemId: string) {
  const session = await requireAuth();

  try {
    await removePortfolioItem(session.user.id, itemId);
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to remove portfolio item",
    };
  }
}

