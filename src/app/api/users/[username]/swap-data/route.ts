import { NextResponse } from "next/server";
import { getSession } from "@/lib/api/auth";
import { getUserByUsername } from "@/lib/services/users";
import { db } from "@/db";
import { userTeachingSkills, userLearningSkills, skills } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get recipient's skills
  const recipientTeaching = await db
    .select({
      id: skills.id,
      name: skills.name,
    })
    .from(userTeachingSkills)
    .innerJoin(skills, eq(userTeachingSkills.skillId, skills.id))
    .where(eq(userTeachingSkills.userId, user.id));

  const recipientLearning = await db
    .select({
      id: skills.id,
      name: skills.name,
    })
    .from(userLearningSkills)
    .innerJoin(skills, eq(userLearningSkills.skillId, skills.id))
    .where(eq(userLearningSkills.userId, user.id));

  // Get my skills
  const myTeaching = await db
    .select({
      id: skills.id,
      name: skills.name,
    })
    .from(userTeachingSkills)
    .innerJoin(skills, eq(userTeachingSkills.skillId, skills.id))
    .where(eq(userTeachingSkills.userId, session.user.id));

  const myLearning = await db
    .select({
      id: skills.id,
      name: skills.name,
    })
    .from(userLearningSkills)
    .innerJoin(skills, eq(userLearningSkills.skillId, skills.id))
    .where(eq(userLearningSkills.userId, session.user.id));

  return NextResponse.json({
    recipient: {
      id: user.id,
      displayName: user.profile?.displayName || username,
      teachingSkills: recipientTeaching,
      learningSkills: recipientLearning,
    },
    mySkills: {
      teaching: myTeaching,
      learning: myLearning,
    },
  });
}
