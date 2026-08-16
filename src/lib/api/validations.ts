import { z } from "zod";

// ============ AUTH VALIDATIONS ============

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(100, "Display name is too long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

// ============ PROFILE VALIDATIONS ============

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(100, "Display name is too long")
    .optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .optional(),
  bio: z.string().max(500, "Bio is too long").optional().nullable(),
  country: z.string().max(100, "Country name is too long").optional().nullable(),
  timezone: z.string().max(100, "Timezone is too long").optional(),
  experienceSummary: z
    .string()
    .max(1000, "Experience summary is too long")
    .optional()
    .nullable(),
  avatarUrl: z.string().url("Invalid URL").optional().nullable(),
});

// ============ SKILL VALIDATIONS ============

export const proficiencyEnum = z.enum([
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]);

export const addTeachingSkillSchema = z.object({
  skillId: z.string().uuid("Invalid skill ID"),
  proficiency: proficiencyEnum,
  yearsExperience: z.number().int().min(0).max(50).optional(),
  description: z.string().max(500, "Description is too long").optional(),
});

export const addLearningSkillSchema = z.object({
  skillId: z.string().uuid("Invalid skill ID"),
  desiredLevel: proficiencyEnum,
  priority: z.number().int().min(1).max(10).optional(),
  description: z.string().max(500, "Description is too long").optional(),
});

// ============ AVAILABILITY VALIDATIONS ============

export const dayOfWeekEnum = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

export const addAvailabilitySchema = z.object({
  dayOfWeek: dayOfWeekEnum,
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  timezone: z.string().max(100).optional(),
});

// ============ SWAP REQUEST VALIDATIONS ============

export const createSwapRequestSchema = z.object({
  recipientId: z.string().uuid("Invalid recipient ID"),
  teachingSkillId: z.string().uuid("Invalid teaching skill ID"),
  learningSkillId: z.string().uuid("Invalid learning skill ID"),
  proposedDuration: z.number().int().min(15).max(180).optional(),
  proposedSchedule: z.string().max(500).optional(),
  message: z.string().max(1000, "Message is too long").optional(),
});

export const respondToRequestSchema = z.object({
  requestId: z.string().uuid("Invalid request ID"),
  action: z.enum(["accept", "decline"]),
});

// ============ SESSION VALIDATIONS ============

export const createSessionSchema = z.object({
  swapId: z.string().uuid("Invalid swap ID"),
  teacherId: z.string().uuid("Invalid teacher ID"),
  learnerId: z.string().uuid("Invalid learner ID"),
  skillId: z.string().uuid("Invalid skill ID"),
  scheduledAt: z.string().datetime("Invalid date format"),
  duration: z.number().int().min(15).max(180),
  timezone: z.string().max(100).optional(),
  meetingUrl: z.string().url("Invalid URL").optional().nullable(),
  objective: z.string().max(500).optional(),
});

export const updateSessionSchema = z.object({
  scheduledAt: z.string().datetime("Invalid date format").optional(),
  duration: z.number().int().min(15).max(180).optional(),
  meetingUrl: z.string().url("Invalid URL").optional().nullable(),
  objective: z.string().max(500).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  status: z
    .enum(["scheduled", "in_progress", "completed", "cancelled", "rescheduled", "missed"])
    .optional(),
});

export const completeSessionSchema = z.object({
  sessionId: z.string().uuid("Invalid session ID"),
  notes: z.string().max(2000).optional(),
});

// ============ MESSAGE VALIDATIONS ============

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid("Invalid conversation ID"),
  body: z.string().min(1, "Message cannot be empty").max(5000, "Message is too long"),
});

// ============ REVIEW VALIDATIONS ============

export const createReviewSchema = z.object({
  sessionId: z.string().uuid("Invalid session ID").optional(),
  swapId: z.string().uuid("Invalid swap ID").optional(),
  revieweeId: z.string().uuid("Invalid reviewee ID"),
  teachingQuality: z.number().int().min(1).max(5),
  communication: z.number().int().min(1).max(5),
  knowledge: z.number().int().min(1).max(5),
  punctuality: z.number().int().min(1).max(5),
  comment: z.string().max(1000, "Comment is too long").optional(),
});

// ============ REPORT VALIDATIONS ============

export const createReportSchema = z.object({
  targetType: z.enum(["user", "message", "review"]),
  targetId: z.string().uuid("Invalid target ID"),
  reason: z.string().max(100, "Reason is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
});

// ============ SEARCH VALIDATIONS ============

export const searchUsersSchema = z.object({
  q: z.string().optional(),
  skillId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  country: z.string().optional(),
  language: z.string().optional(),
  proficiency: proficiencyEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

// ============ PORTFOLIO VALIDATIONS ============

export const addPortfolioItemSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  url: z.string().url("Invalid URL").optional().nullable(),
  imageUrl: z.string().url("Invalid URL").optional().nullable(),
});

// ============ LANGUAGE VALIDATIONS ============

export const addUserLanguageSchema = z.object({
  languageId: z.string().uuid("Invalid language ID"),
  proficiency: proficiencyEnum,
});

// Types
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddTeachingSkillInput = z.infer<typeof addTeachingSkillSchema>;
export type AddLearningSkillInput = z.infer<typeof addLearningSkillSchema>;
export type CreateSwapRequestInput = z.infer<typeof createSwapRequestSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type SearchUsersInput = z.infer<typeof searchUsersSchema>;

