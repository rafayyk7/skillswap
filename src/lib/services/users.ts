import { db } from "@/db";
import {
  users,
  profiles,
  emailVerifications,
  passwordResets,
  userTeachingSkills,
  userLearningSkills,
  userLanguages,
  availability,
  portfolioItems,
  reviews,
  skills,
  languages,
  categories,
} from "@/db/schema";
import { eq, and, gt, sql, desc, or, ilike, inArray } from "drizzle-orm";
import { hashPassword, createSession, setSessionCookie } from "@/lib/api/auth";
import { generateToken } from "@/lib/utils";
import type { SignupInput, UpdateProfileInput } from "@/lib/api/validations";

export async function createUser(input: SignupInput) {
  const { email, password, displayName, username } = input;

  // Check if email exists
  const existingEmail = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (existingEmail.length > 0) {
    throw new Error("Email already registered");
  }

  // Check if username exists
  const existingUsername = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.username, username.toLowerCase()))
    .limit(1);

  if (existingUsername.length > 0) {
    throw new Error("Username already taken");
  }

  const passwordHash = await hashPassword(password);

  // Create user and profile in transaction
  const result = await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        status: "pending",
        emailVerified: false,
      })
      .returning();

    const [profile] = await tx
      .insert(profiles)
      .values({
        userId: user.id,
        username: username.toLowerCase(),
        displayName,
      })
      .returning();

    // Create email verification token
    const verificationToken = generateToken(64);
    await tx.insert(emailVerifications).values({
      userId: user.id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    return { user, profile, verificationToken };
  });

  // Create session and set cookie
  const { token, expiresAt } = await createSession(result.user.id);
  await setSessionCookie(token, expiresAt);

  return {
    user: {
      id: result.user.id,
      email: result.user.email,
      status: result.user.status,
      emailVerified: result.user.emailVerified,
    },
    profile: result.profile,
    verificationToken: result.verificationToken,
  };
}

export async function verifyEmail(token: string) {
  const [verification] = await db
    .select()
    .from(emailVerifications)
    .where(
      and(
        eq(emailVerifications.token, token),
        gt(emailVerifications.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!verification) {
    throw new Error("Invalid or expired verification token");
  }

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({
        emailVerified: true,
        status: "active",
        updatedAt: new Date(),
      })
      .where(eq(users.id, verification.userId));

    await tx
      .delete(emailVerifications)
      .where(eq(emailVerifications.id, verification.id));
  });

  return true;
}

export async function createPasswordResetToken(email: string) {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    // Don't reveal if email exists
    return null;
  }

  const resetToken = generateToken(64);
  await db.insert(passwordResets).values({
    userId: user.id,
    token: resetToken,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  });

  return resetToken;
}

export async function resetPassword(token: string, newPassword: string) {
  const [reset] = await db
    .select()
    .from(passwordResets)
    .where(
      and(
        eq(passwordResets.token, token),
        gt(passwordResets.expiresAt, new Date()),
        sql`${passwordResets.usedAt} IS NULL`
      )
    )
    .limit(1);

  if (!reset) {
    throw new Error("Invalid or expired reset token");
  }

  const passwordHash = await hashPassword(newPassword);

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, reset.userId));

    await tx
      .update(passwordResets)
      .set({ usedAt: new Date() })
      .where(eq(passwordResets.id, reset.id));
  });

  return true;
}

export async function getUserById(userId: string) {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      status: users.status,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      profile: {
        id: profiles.id,
        username: profiles.username,
        displayName: profiles.displayName,
        avatarUrl: profiles.avatarUrl,
        bio: profiles.bio,
        country: profiles.country,
        timezone: profiles.timezone,
        experienceSummary: profiles.experienceSummary,
      },
    })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return user || null;
}

export async function getUserByUsername(username: string) {
  const [result] = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      status: users.status,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      profile: {
        id: profiles.id,
        username: profiles.username,
        displayName: profiles.displayName,
        avatarUrl: profiles.avatarUrl,
        bio: profiles.bio,
        country: profiles.country,
        timezone: profiles.timezone,
        experienceSummary: profiles.experienceSummary,
      },
    })
    .from(profiles)
    .innerJoin(users, eq(profiles.userId, users.id))
    .where(eq(profiles.username, username.toLowerCase()))
    .limit(1);

  return result || null;
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  // Check username uniqueness if changing
  if (input.username) {
    const existing = await db
      .select({ id: profiles.id, userId: profiles.userId })
      .from(profiles)
      .where(eq(profiles.username, input.username.toLowerCase()))
      .limit(1);

    if (existing.length > 0 && existing[0].userId !== userId) {
      throw new Error("Username already taken");
    }
  }

  const [profile] = await db
    .update(profiles)
    .set({
      ...input,
      username: input.username?.toLowerCase(),
      updatedAt: new Date(),
    })
    .where(eq(profiles.userId, userId))
    .returning();

  return profile;
}

export async function getFullUserProfile(userId: string) {
  const user = await getUserById(userId);
  if (!user) return null;

  const [teachingSkillsData, learningSkillsData, languagesData, availabilityData, portfolioData, reviewsData] =
    await Promise.all([
      db
        .select({
          id: userTeachingSkills.id,
          proficiency: userTeachingSkills.proficiency,
          yearsExperience: userTeachingSkills.yearsExperience,
          description: userTeachingSkills.description,
          skill: {
            id: skills.id,
            name: skills.name,
            slug: skills.slug,
            categoryId: skills.categoryId,
          },
        })
        .from(userTeachingSkills)
        .innerJoin(skills, eq(userTeachingSkills.skillId, skills.id))
        .where(eq(userTeachingSkills.userId, userId)),
      db
        .select({
          id: userLearningSkills.id,
          desiredLevel: userLearningSkills.desiredLevel,
          priority: userLearningSkills.priority,
          description: userLearningSkills.description,
          skill: {
            id: skills.id,
            name: skills.name,
            slug: skills.slug,
            categoryId: skills.categoryId,
          },
        })
        .from(userLearningSkills)
        .innerJoin(skills, eq(userLearningSkills.skillId, skills.id))
        .where(eq(userLearningSkills.userId, userId)),
      db
        .select({
          id: userLanguages.id,
          proficiency: userLanguages.proficiency,
          language: {
            id: languages.id,
            name: languages.name,
            code: languages.code,
          },
        })
        .from(userLanguages)
        .innerJoin(languages, eq(userLanguages.languageId, languages.id))
        .where(eq(userLanguages.userId, userId)),
      db
        .select()
        .from(availability)
        .where(eq(availability.userId, userId)),
      db
        .select()
        .from(portfolioItems)
        .where(eq(portfolioItems.userId, userId)),
      db
        .select({
          teachingQuality: reviews.teachingQuality,
          communication: reviews.communication,
          knowledge: reviews.knowledge,
          punctuality: reviews.punctuality,
          overallRating: reviews.overallRating,
        })
        .from(reviews)
        .where(eq(reviews.revieweeId, userId)),
    ]);

  // Calculate average rating
  const avgRating =
    reviewsData.length > 0
      ? reviewsData.reduce((acc, r) => acc + Number(r.overallRating), 0) /
        reviewsData.length
      : null;

  return {
    ...user,
    teachingSkills: teachingSkillsData,
    learningSkills: learningSkillsData,
    languages: languagesData,
    availability: availabilityData,
    portfolio: portfolioData,
    reviewCount: reviewsData.length,
    averageRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
  };
}

export async function addTeachingSkill(
  userId: string,
  skillId: string,
  proficiency: "beginner" | "intermediate" | "advanced" | "expert",
  yearsExperience?: number,
  description?: string
) {
  // Check if skill exists
  const [skill] = await db
    .select({ id: skills.id })
    .from(skills)
    .where(eq(skills.id, skillId))
    .limit(1);

  if (!skill) {
    throw new Error("Skill not found");
  }

  // Check if already added
  const [existing] = await db
    .select({ id: userTeachingSkills.id })
    .from(userTeachingSkills)
    .where(
      and(
        eq(userTeachingSkills.userId, userId),
        eq(userTeachingSkills.skillId, skillId)
      )
    )
    .limit(1);

  if (existing) {
    throw new Error("You already teach this skill");
  }

  const [result] = await db
    .insert(userTeachingSkills)
    .values({
      userId,
      skillId,
      proficiency,
      yearsExperience,
      description,
    })
    .returning();

  return result;
}

export async function removeTeachingSkill(userId: string, skillId: string) {
  await db
    .delete(userTeachingSkills)
    .where(
      and(
        eq(userTeachingSkills.userId, userId),
        eq(userTeachingSkills.skillId, skillId)
      )
    );
}

export async function addLearningSkill(
  userId: string,
  skillId: string,
  desiredLevel: "beginner" | "intermediate" | "advanced" | "expert",
  priority?: number,
  description?: string
) {
  const [skill] = await db
    .select({ id: skills.id })
    .from(skills)
    .where(eq(skills.id, skillId))
    .limit(1);

  if (!skill) {
    throw new Error("Skill not found");
  }

  const [existing] = await db
    .select({ id: userLearningSkills.id })
    .from(userLearningSkills)
    .where(
      and(
        eq(userLearningSkills.userId, userId),
        eq(userLearningSkills.skillId, skillId)
      )
    )
    .limit(1);

  if (existing) {
    throw new Error("You already want to learn this skill");
  }

  const [result] = await db
    .insert(userLearningSkills)
    .values({
      userId,
      skillId,
      desiredLevel,
      priority,
      description,
    })
    .returning();

  return result;
}

export async function removeLearningSkill(userId: string, skillId: string) {
  await db
    .delete(userLearningSkills)
    .where(
      and(
        eq(userLearningSkills.userId, userId),
        eq(userLearningSkills.skillId, skillId)
      )
    );
}

export async function addUserLanguage(
  userId: string,
  languageId: string,
  proficiency: "beginner" | "intermediate" | "advanced" | "expert"
) {
  const [existing] = await db
    .select({ id: userLanguages.id })
    .from(userLanguages)
    .where(
      and(
        eq(userLanguages.userId, userId),
        eq(userLanguages.languageId, languageId)
      )
    )
    .limit(1);

  if (existing) {
    throw new Error("Language already added");
  }

  const [result] = await db
    .insert(userLanguages)
    .values({ userId, languageId, proficiency })
    .returning();

  return result;
}

export async function removeUserLanguage(userId: string, languageId: string) {
  await db
    .delete(userLanguages)
    .where(
      and(
        eq(userLanguages.userId, userId),
        eq(userLanguages.languageId, languageId)
      )
    );
}

export async function setAvailability(
  userId: string,
  slots: Array<{
    dayOfWeek: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    startTime: string;
    endTime: string;
    timezone?: string;
  }>
) {
  await db.transaction(async (tx) => {
    // Clear existing availability
    await tx.delete(availability).where(eq(availability.userId, userId));

    // Insert new slots
    if (slots.length > 0) {
      await tx.insert(availability).values(
        slots.map((slot) => ({
          userId,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          timezone: slot.timezone || "UTC",
        }))
      );
    }
  });
}

export async function addPortfolioItem(
  userId: string,
  title: string,
  description?: string,
  url?: string,
  imageUrl?: string
) {
  const [result] = await db
    .insert(portfolioItems)
    .values({ userId, title, description, url, imageUrl })
    .returning();

  return result;
}

export async function removePortfolioItem(userId: string, itemId: string) {
  await db
    .delete(portfolioItems)
    .where(
      and(eq(portfolioItems.id, itemId), eq(portfolioItems.userId, userId))
    );
}

