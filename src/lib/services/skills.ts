import { db } from "@/db";
import { skills, categories, userTeachingSkills, userLearningSkills } from "@/db/schema";
import { eq, ilike, sql, and, desc } from "drizzle-orm";
import { slugify } from "@/lib/utils";

export async function getAllCategories() {
  return db.select().from(categories).orderBy(categories.name);
}

export async function getCategoryBySlug(slug: string) {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  return category || null;
}

export async function getAllSkills() {
  return db
    .select({
      id: skills.id,
      name: skills.name,
      slug: skills.slug,
      description: skills.description,
      categoryId: skills.categoryId,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
    })
    .from(skills)
    .innerJoin(categories, eq(skills.categoryId, categories.id))
    .orderBy(skills.name);
}

export async function getSkillsByCategory(categoryId: string) {
  return db
    .select()
    .from(skills)
    .where(eq(skills.categoryId, categoryId))
    .orderBy(skills.name);
}

export async function getSkillBySlug(slug: string) {
  const [skill] = await db
    .select({
      id: skills.id,
      name: skills.name,
      slug: skills.slug,
      description: skills.description,
      categoryId: skills.categoryId,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
    })
    .from(skills)
    .innerJoin(categories, eq(skills.categoryId, categories.id))
    .where(eq(skills.slug, slug))
    .limit(1);

  return skill || null;
}

export async function getSkillById(id: string) {
  const [skill] = await db
    .select({
      id: skills.id,
      name: skills.name,
      slug: skills.slug,
      description: skills.description,
      categoryId: skills.categoryId,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
    })
    .from(skills)
    .innerJoin(categories, eq(skills.categoryId, categories.id))
    .where(eq(skills.id, id))
    .limit(1);

  return skill || null;
}

export async function searchSkills(query: string, limit = 10) {
  return db
    .select({
      id: skills.id,
      name: skills.name,
      slug: skills.slug,
      categoryId: skills.categoryId,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
    })
    .from(skills)
    .innerJoin(categories, eq(skills.categoryId, categories.id))
    .where(ilike(skills.name, `%${query}%`))
    .orderBy(skills.name)
    .limit(limit);
}

export async function createSkill(
  name: string,
  categoryId: string,
  description?: string
) {
  const slug = slugify(name);

  // Check if skill already exists
  const [existing] = await db
    .select({ id: skills.id })
    .from(skills)
    .where(eq(skills.slug, slug))
    .limit(1);

  if (existing) {
    throw new Error("Skill already exists");
  }

  const [skill] = await db
    .insert(skills)
    .values({ name, slug, categoryId, description })
    .returning();

  return skill;
}

export async function getPopularSkills(limit = 10) {
  // Get skills ordered by how many users teach/learn them
  const teachingCounts = db
    .select({
      skillId: userTeachingSkills.skillId,
      count: sql<number>`count(*)::int`.as("count"),
    })
    .from(userTeachingSkills)
    .groupBy(userTeachingSkills.skillId)
    .as("teaching_counts");

  const learningCounts = db
    .select({
      skillId: userLearningSkills.skillId,
      count: sql<number>`count(*)::int`.as("count"),
    })
    .from(userLearningSkills)
    .groupBy(userLearningSkills.skillId)
    .as("learning_counts");

  return db
    .select({
      id: skills.id,
      name: skills.name,
      slug: skills.slug,
      categoryId: skills.categoryId,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
      teacherCount: sql<number>`COALESCE(${teachingCounts.count}, 0)`,
      learnerCount: sql<number>`COALESCE(${learningCounts.count}, 0)`,
    })
    .from(skills)
    .innerJoin(categories, eq(skills.categoryId, categories.id))
    .leftJoin(teachingCounts, eq(skills.id, teachingCounts.skillId))
    .leftJoin(learningCounts, eq(skills.id, learningCounts.skillId))
    .orderBy(
      desc(
        sql`COALESCE(${teachingCounts.count}, 0) + COALESCE(${learningCounts.count}, 0)`
      )
    )
    .limit(limit);
}

// Admin functions
export async function createCategory(
  name: string,
  description?: string,
  icon?: string
) {
  const slug = slugify(name);

  const [existing] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  if (existing) {
    throw new Error("Category already exists");
  }

  const [category] = await db
    .insert(categories)
    .values({ name, slug, description, icon })
    .returning();

  return category;
}

export async function updateCategory(
  id: string,
  name: string,
  description?: string,
  icon?: string
) {
  const slug = slugify(name);

  const [category] = await db
    .update(categories)
    .set({ name, slug, description, icon })
    .where(eq(categories.id, id))
    .returning();

  return category;
}

export async function deleteCategory(id: string) {
  // This will cascade delete related skills
  await db.delete(categories).where(eq(categories.id, id));
}

export async function updateSkill(
  id: string,
  name: string,
  categoryId: string,
  description?: string
) {
  const slug = slugify(name);

  const [skill] = await db
    .update(skills)
    .set({ name, slug, categoryId, description })
    .where(eq(skills.id, id))
    .returning();

  return skill;
}

export async function deleteSkill(id: string) {
  await db.delete(skills).where(eq(skills.id, id));
}

