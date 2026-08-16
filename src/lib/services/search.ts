import { db } from "@/db";
import {
  users,
  profiles,
  userTeachingSkills,
  userLearningSkills,
  userLanguages,
  skills,
  languages,
  reviews,
} from "@/db/schema";
import { eq, and, or, ilike, sql, desc, ne, inArray } from "drizzle-orm";
import type { SearchUsersInput } from "@/lib/api/validations";

export async function searchUsers(
  currentUserId: string,
  input: SearchUsersInput
) {
  const {
    q,
    skillId,
    categoryId,
    country,
    language,
    proficiency,
    page,
    limit,
  } = input;

  const offset = (page - 1) * limit;

  // Get all matching user IDs based on filters
  let userIdsFromSkill: string[] = [];
  let userIdsFromCategory: string[] = [];
  let userIdsFromLanguage: string[] = [];

  // Filter by specific skill
  if (skillId) {
    const usersWithSkill = await db
      .select({ userId: userTeachingSkills.userId })
      .from(userTeachingSkills)
      .where(
        proficiency
          ? and(
              eq(userTeachingSkills.skillId, skillId),
              eq(userTeachingSkills.proficiency, proficiency)
            )
          : eq(userTeachingSkills.skillId, skillId)
      );
    userIdsFromSkill = usersWithSkill.map((u) => u.userId);
  }

  // Filter by category
  if (categoryId) {
    const skillsInCategory = await db
      .select({ id: skills.id })
      .from(skills)
      .where(eq(skills.categoryId, categoryId));

    const skillIds = skillsInCategory.map((s) => s.id);

    if (skillIds.length > 0) {
      const usersWithCategorySkills = await db
        .select({ userId: userTeachingSkills.userId })
        .from(userTeachingSkills)
        .where(inArray(userTeachingSkills.skillId, skillIds));
      userIdsFromCategory = usersWithCategorySkills.map((u) => u.userId);
    }
  }

  // Filter by language
  if (language) {
    const [lang] = await db
      .select({ id: languages.id })
      .from(languages)
      .where(ilike(languages.name, `%${language}%`))
      .limit(1);

    if (lang) {
      const usersWithLanguage = await db
        .select({ userId: userLanguages.userId })
        .from(userLanguages)
        .where(eq(userLanguages.languageId, lang.id));
      userIdsFromLanguage = usersWithLanguage.map((u) => u.userId);
    }
  }

  // Build conditions
  const baseConditions = and(
    ne(users.id, currentUserId),
    eq(users.status, "active"),
    eq(users.emailVerified, true)
  );

  // Build where clause for text search and country
  let whereClause = baseConditions;
  
  if (q) {
    whereClause = and(
      baseConditions,
      or(
        ilike(profiles.displayName, `%${q}%`),
        ilike(profiles.username, `%${q}%`),
        ilike(profiles.bio, `%${q}%`)
      )
    );
  }

  if (country) {
    whereClause = and(whereClause, ilike(profiles.country, `%${country}%`));
  }

  // Get all users
  const allUsers = await db
    .select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
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
    .innerJoin(profiles, eq(users.id, profiles.userId))
    .where(whereClause);

  // Filter by skill/category/language
  let filteredUsers = allUsers;

  if (skillId) {
    if (userIdsFromSkill.length > 0) {
      filteredUsers = filteredUsers.filter((u) =>
        userIdsFromSkill.includes(u.id)
      );
    } else {
      filteredUsers = [];
    }
  }

  if (categoryId) {
    if (userIdsFromCategory.length > 0) {
      filteredUsers = filteredUsers.filter((u) =>
        userIdsFromCategory.includes(u.id)
      );
    } else {
      filteredUsers = [];
    }
  }

  if (language) {
    if (userIdsFromLanguage.length > 0) {
      filteredUsers = filteredUsers.filter((u) =>
        userIdsFromLanguage.includes(u.id)
      );
    } else {
      filteredUsers = [];
    }
  }

  const total = filteredUsers.length;
  const paginatedUsers = filteredUsers.slice(offset, offset + limit);

  // Enrich with skills and ratings
  const enrichedUsers = await Promise.all(
    paginatedUsers.map(async (user) => {
      const teachingSkills = await db
        .select({
          id: userTeachingSkills.id,
          proficiency: userTeachingSkills.proficiency,
          skill: {
            id: skills.id,
            name: skills.name,
          },
        })
        .from(userTeachingSkills)
        .innerJoin(skills, eq(userTeachingSkills.skillId, skills.id))
        .where(eq(userTeachingSkills.userId, user.id));

      const learningSkills = await db
        .select({
          id: userLearningSkills.id,
          skill: {
            id: skills.id,
            name: skills.name,
          },
        })
        .from(userLearningSkills)
        .innerJoin(skills, eq(userLearningSkills.skillId, skills.id))
        .where(eq(userLearningSkills.userId, user.id));

      const userReviews = await db
        .select({ overallRating: reviews.overallRating })
        .from(reviews)
        .where(eq(reviews.revieweeId, user.id));

      const avgRating =
        userReviews.length > 0
          ? userReviews.reduce((sum, r) => sum + Number(r.overallRating), 0) /
            userReviews.length
          : null;

      return {
        ...user,
        teachingSkills,
        learningSkills,
        averageRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
        reviewCount: userReviews.length,
      };
    })
  );

  return {
    users: enrichedUsers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getPopularTeachers(limit = 10) {
  // Get users with most completed sessions/highest ratings
  const usersWithReviews = await db
    .select({
      userId: reviews.revieweeId,
      avgRating: sql<number>`AVG(${reviews.overallRating}::numeric)`.as(
        "avg_rating"
      ),
      reviewCount: sql<number>`COUNT(*)::int`.as("review_count"),
    })
    .from(reviews)
    .groupBy(reviews.revieweeId)
    .having(sql`COUNT(*) >= 1`)
    .orderBy(desc(sql`AVG(${reviews.overallRating}::numeric)`))
    .limit(limit * 2);

  const userIds = usersWithReviews.map((u) => u.userId);

  if (userIds.length === 0) {
    return [];
  }

  const popularUsers = await db
    .select({
      id: users.id,
      profile: {
        username: profiles.username,
        displayName: profiles.displayName,
        avatarUrl: profiles.avatarUrl,
        bio: profiles.bio,
        country: profiles.country,
      },
    })
    .from(users)
    .innerJoin(profiles, eq(users.id, profiles.userId))
    .where(and(eq(users.status, "active"), inArray(users.id, userIds)))
    .limit(limit);

  // Enrich with skills and ratings
  const enrichedUsers = await Promise.all(
    popularUsers.map(async (user) => {
      const teachingSkills = await db
        .select({
          skill: { id: skills.id, name: skills.name },
        })
        .from(userTeachingSkills)
        .innerJoin(skills, eq(userTeachingSkills.skillId, skills.id))
        .where(eq(userTeachingSkills.userId, user.id))
        .limit(3);

      const reviewData = usersWithReviews.find((r) => r.userId === user.id);

      return {
        ...user,
        teachingSkills: teachingSkills.map((s) => s.skill),
        averageRating: reviewData
          ? Math.round(Number(reviewData.avgRating) * 10) / 10
          : null,
        reviewCount: reviewData?.reviewCount || 0,
      };
    })
  );

  return enrichedUsers;
}

