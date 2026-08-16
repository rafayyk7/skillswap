import { db } from "@/db";
import {
  users,
  profiles,
  userTeachingSkills,
  userLearningSkills,
  userLanguages,
  availability,
  reviews,
  skills,
  languages,
} from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";

type Proficiency = "beginner" | "intermediate" | "advanced" | "expert";

interface MatchResult {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  country: string | null;
  timezone: string;
  matchScore: number;
  skillMatch: {
    theyTeach: Array<{ id: string; name: string; proficiency: Proficiency }>;
    theyWantToLearn: Array<{ id: string; name: string }>;
    youTeach: Array<{ id: string; name: string }>;
    youWantToLearn: Array<{ id: string; name: string }>;
  };
  sharedLanguages: Array<{ name: string; code: string }>;
  availabilityOverlap: number;
  averageRating: number | null;
  reviewCount: number;
}

export async function findMatches(
  userId: string,
  options: {
    skillId?: string;
    categoryId?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ matches: MatchResult[]; total: number }> {
  const { skillId, limit = 20, offset = 0 } = options;

  // Get current user's teaching and learning skills
  const [myTeachingSkills, myLearningSkills, myLanguages, myAvailability] =
    await Promise.all([
      db
        .select({
          skillId: userTeachingSkills.skillId,
          proficiency: userTeachingSkills.proficiency,
          skillName: skills.name,
        })
        .from(userTeachingSkills)
        .innerJoin(skills, eq(userTeachingSkills.skillId, skills.id))
        .where(eq(userTeachingSkills.userId, userId)),
      db
        .select({
          skillId: userLearningSkills.skillId,
          desiredLevel: userLearningSkills.desiredLevel,
          skillName: skills.name,
        })
        .from(userLearningSkills)
        .innerJoin(skills, eq(userLearningSkills.skillId, skills.id))
        .where(eq(userLearningSkills.userId, userId)),
      db
        .select({ languageId: userLanguages.languageId })
        .from(userLanguages)
        .where(eq(userLanguages.userId, userId)),
      db.select().from(availability).where(eq(availability.userId, userId)),
    ]);

  const myTeachingSkillIds = myTeachingSkills.map((s) => s.skillId);
  const myLearningSkillIds = myLearningSkills.map((s) => s.skillId);
  const myLanguageIds = myLanguages.map((l) => l.languageId);

  if (myTeachingSkillIds.length === 0 && myLearningSkillIds.length === 0) {
    return { matches: [], total: 0 };
  }

  // Find potential matches - users who teach what I want to learn OR want to learn what I teach
  const baseQuery = db
    .selectDistinct({
      userId: users.id,
    })
    .from(users)
    .innerJoin(profiles, eq(users.id, profiles.userId))
    .where(
      and(
        ne(users.id, userId),
        eq(users.status, "active"),
        eq(users.emailVerified, true)
      )
    );

  // Get all potential match users
  const potentialMatchUsers = await baseQuery;
  const potentialUserIds = potentialMatchUsers.map((u) => u.userId);

  if (potentialUserIds.length === 0) {
    return { matches: [], total: 0 };
  }

  // Get detailed info for potential matches
  const matchDetailsPromises = potentialUserIds.map(async (matchUserId): Promise<MatchResult | null> => {
    const [
      profileData,
      theirTeachingSkills,
      theirLearningSkills,
      theirLanguages,
      theirAvailability,
      theirReviews,
    ] = await Promise.all([
      db
        .select({
          username: profiles.username,
          displayName: profiles.displayName,
          avatarUrl: profiles.avatarUrl,
          bio: profiles.bio,
          country: profiles.country,
          timezone: profiles.timezone,
        })
        .from(profiles)
        .where(eq(profiles.userId, matchUserId))
        .limit(1),
      db
        .select({
          skillId: userTeachingSkills.skillId,
          proficiency: userTeachingSkills.proficiency,
          skillName: skills.name,
        })
        .from(userTeachingSkills)
        .innerJoin(skills, eq(userTeachingSkills.skillId, skills.id))
        .where(eq(userTeachingSkills.userId, matchUserId)),
      db
        .select({
          skillId: userLearningSkills.skillId,
          desiredLevel: userLearningSkills.desiredLevel,
          skillName: skills.name,
        })
        .from(userLearningSkills)
        .innerJoin(skills, eq(userLearningSkills.skillId, skills.id))
        .where(eq(userLearningSkills.userId, matchUserId)),
      db
        .select({
          languageId: userLanguages.languageId,
          languageName: languages.name,
          languageCode: languages.code,
        })
        .from(userLanguages)
        .innerJoin(languages, eq(userLanguages.languageId, languages.id))
        .where(eq(userLanguages.userId, matchUserId)),
      db
        .select()
        .from(availability)
        .where(eq(availability.userId, matchUserId)),
      db
        .select({ overallRating: reviews.overallRating })
        .from(reviews)
        .where(eq(reviews.revieweeId, matchUserId)),
    ]);

    const profile = profileData[0];
    if (!profile) return null;

    // Calculate skill match score (50%)
    let skillScore = 0;
    const theirTeachIds = theirTeachingSkills.map((s) => s.skillId);
    const theirLearnIds = theirLearningSkills.map((s) => s.skillId);

    // Reciprocal match: they teach what I want AND want what I teach
    const theyTeachWhatIWant = myLearningSkillIds.filter((id) =>
      theirTeachIds.includes(id)
    );
    const theyWantWhatITeach = myTeachingSkillIds.filter((id) =>
      theirLearnIds.includes(id)
    );

    if (theyTeachWhatIWant.length > 0 && theyWantWhatITeach.length > 0) {
      // Perfect reciprocal match
      skillScore = 50;
    } else if (theyTeachWhatIWant.length > 0 || theyWantWhatITeach.length > 0) {
      // Partial match
      skillScore = 25;
    }

    // If filtering by skill, check if it matches
    if (skillId) {
      if (!theirTeachIds.includes(skillId) && !theirLearnIds.includes(skillId)) {
        return null;
      }
    }

    // Experience compatibility score (15%)
    let experienceScore = 0;
    if (theyTeachWhatIWant.length > 0) {
      const matchingSkill = theirTeachingSkills.find((s) =>
        theyTeachWhatIWant.includes(s.skillId)
      );
      const myDesiredSkill = myLearningSkills.find((s) =>
        theyTeachWhatIWant.includes(s.skillId)
      );

      if (matchingSkill && myDesiredSkill) {
        const proficiencyLevels: Proficiency[] = ["beginner", "intermediate", "advanced", "expert"];
        const teacherLevel = proficiencyLevels.indexOf(matchingSkill.proficiency);
        const desiredLevel = proficiencyLevels.indexOf(myDesiredSkill.desiredLevel);

        if (teacherLevel >= desiredLevel) {
          experienceScore = 15;
        } else {
          experienceScore = 7;
        }
      }
    }

    // Language compatibility score (10%)
    let languageScore = 0;
    const sharedLanguages = theirLanguages.filter((l) =>
      myLanguageIds.includes(l.languageId)
    );
    if (sharedLanguages.length > 0) {
      languageScore = 10;
    }

    // Availability overlap score (15%)
    let availabilityScore = 0;
    if (myAvailability.length > 0 && theirAvailability.length > 0) {
      let overlapCount = 0;
      for (const mySlot of myAvailability) {
        for (const theirSlot of theirAvailability) {
          if (mySlot.dayOfWeek === theirSlot.dayOfWeek) {
            overlapCount++;
          }
        }
      }
      availabilityScore = Math.min(15, (overlapCount / myAvailability.length) * 15);
    }

    // Rating score (10%)
    let ratingScore = 0;
    const avgRating =
      theirReviews.length > 0
        ? theirReviews.reduce((sum, r) => sum + Number(r.overallRating), 0) /
          theirReviews.length
        : null;

    if (avgRating) {
      ratingScore = (avgRating / 5) * 10;
    }

    const totalScore = Math.round(
      skillScore + experienceScore + languageScore + availabilityScore + ratingScore
    );

    // Skip if no meaningful match
    if (totalScore < 10) return null;

    return {
      userId: matchUserId,
      username: profile.username,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      country: profile.country,
      timezone: profile.timezone,
      matchScore: totalScore,
      skillMatch: {
        theyTeach: theirTeachingSkills
          .filter((s) => theyTeachWhatIWant.includes(s.skillId))
          .map((s) => ({
            id: s.skillId,
            name: s.skillName,
            proficiency: s.proficiency,
          })),
        theyWantToLearn: theirLearningSkills
          .filter((s) => theyWantWhatITeach.includes(s.skillId))
          .map((s) => ({
            id: s.skillId,
            name: s.skillName,
          })),
        youTeach: myTeachingSkills
          .filter((s) => theyWantWhatITeach.includes(s.skillId))
          .map((s) => ({
            id: s.skillId,
            name: s.skillName,
          })),
        youWantToLearn: myLearningSkills
          .filter((s) => theyTeachWhatIWant.includes(s.skillId))
          .map((s) => ({
            id: s.skillId,
            name: s.skillName,
          })),
      },
      sharedLanguages: sharedLanguages.map((l) => ({
        name: l.languageName,
        code: l.languageCode,
      })),
      availabilityOverlap: Math.round((availabilityScore / 15) * 100),
      averageRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
      reviewCount: theirReviews.length,
    };
  });

  const matchDetails = await Promise.all(matchDetailsPromises);

  // Filter out nulls and sort by score
  const validMatches: MatchResult[] = [];
  for (const match of matchDetails) {
    if (match !== null) {
      validMatches.push(match);
    }
  }
  
  validMatches.sort((a, b) => b.matchScore - a.matchScore);

  const total = validMatches.length;
  const paginatedMatches = validMatches.slice(offset, offset + limit);

  return { matches: paginatedMatches, total };
}

export async function getSuggestedMatches(userId: string, limit = 5) {
  const { matches } = await findMatches(userId, { limit });
  return matches;
}

