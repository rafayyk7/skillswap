import { db } from "@/db";
import { reports, profiles, users } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import type { createReportSchema } from "@/lib/api/validations";
import type { z } from "zod";

type CreateReportInput = z.infer<typeof createReportSchema>;

export async function createReport(userId: string, input: CreateReportInput) {
  const { targetType, targetId, reason, description } = input;

  // Cannot report yourself
  if (targetType === "user" && targetId === userId) {
    throw new Error("Cannot report yourself");
  }

  // Check for duplicate recent report
  const [existingReport] = await db
    .select({ id: reports.id })
    .from(reports)
    .where(
      and(
        eq(reports.reporterId, userId),
        eq(reports.targetType, targetType),
        eq(reports.targetId, targetId),
        eq(reports.status, "open")
      )
    )
    .limit(1);

  if (existingReport) {
    throw new Error("You have already reported this");
  }

  const [report] = await db
    .insert(reports)
    .values({
      reporterId: userId,
      targetType,
      targetId,
      reason,
      description,
      status: "open",
    })
    .returning();

  return report;
}

export async function getReports(
  status?: "open" | "reviewing" | "resolved" | "dismissed",
  options: { limit?: number; offset?: number } = {}
) {
  const { limit = 20, offset = 0 } = options;

  let whereClause;
  if (status) {
    whereClause = eq(reports.status, status);
  }

  const reportList = await db
    .select()
    .from(reports)
    .where(whereClause)
    .orderBy(desc(reports.createdAt))
    .limit(limit)
    .offset(offset);

  // Enrich with reporter info
  const enrichedReports = await Promise.all(
    reportList.map(async (report) => {
      const [reporterProfile] = await db
        .select({
          username: profiles.username,
          displayName: profiles.displayName,
        })
        .from(profiles)
        .where(eq(profiles.userId, report.reporterId))
        .limit(1);

      let targetInfo = null;
      if (report.targetType === "user") {
        const [targetProfile] = await db
          .select({
            username: profiles.username,
            displayName: profiles.displayName,
          })
          .from(profiles)
          .where(eq(profiles.userId, report.targetId))
          .limit(1);
        targetInfo = targetProfile;
      }

      return {
        ...report,
        reporter: reporterProfile,
        targetInfo,
      };
    })
  );

  return enrichedReports;
}

export async function updateReportStatus(
  reportId: string,
  adminId: string,
  status: "reviewing" | "resolved" | "dismissed"
) {
  const [report] = await db
    .update(reports)
    .set({
      status,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    })
    .where(eq(reports.id, reportId))
    .returning();

  return report;
}

export async function getReportCounts() {
  const openCount = await db
    .select({ id: reports.id })
    .from(reports)
    .where(eq(reports.status, "open"));

  const reviewingCount = await db
    .select({ id: reports.id })
    .from(reports)
    .where(eq(reports.status, "reviewing"));

  return {
    open: openCount.length,
    reviewing: reviewingCount.length,
  };
}

