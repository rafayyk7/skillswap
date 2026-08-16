export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type AvailabilityDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type SessionDuration = 30 | 60 | 90 | 120;

export type SwapRequestStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "cancelled"
  | "completed";

export type SessionStatus =
  | "scheduled"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "rescheduled";

export type NotificationType =
  | "swap_request"
  | "request_accepted"
  | "request_declined"
  | "session_reminder"
  | "new_message"
  | "review_received"
  | "session_completed";

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export interface Skill {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  level: SkillLevel;
  yearsOfExperience: number;
  description: string;
  teacherCount?: number;
}

export interface SkillOffer {
  id: string;
  skill: Skill;
  userId: string;
  description: string;
  level: SkillLevel;
  yearsOfExperience: number;
}

export interface SkillRequest {
  id: string;
  skill: Skill;
  userId: string;
  description: string;
  desiredLevel: SkillLevel;
}

export interface Availability {
  days: AvailabilityDay[];
  timeStart: string;
  timeEnd: string;
  timezone: string;
  preferredDuration: SessionDuration;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  country: string;
  city?: string;
  languages: string[];
  skillsTeach: SkillOffer[];
  skillsLearn: SkillRequest[];
  availability: Availability;
  rating: number;
  reviewCount: number;
  completedSwaps: number;
  joinedDate: string;
  isOnline: boolean;
  isPremium?: boolean;
  portfolio?: PortfolioItem[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
}

export interface Match {
  userId: string;
  user: User;
  matchPercentage: number;
  teachingSkill: Skill;
  learningSkill: Skill;
  commonLanguages: string[];
  compatibilityReasons: string[];
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: User;
  toUser: User;
  teachSkill: Skill;
  learnSkill: Skill;
  status: SwapRequestStatus;
  message: string;
  proposedDays: AvailabilityDay[];
  proposedTime: string;
  sessionDuration: SessionDuration;
  createdAt: string;
  updatedAt: string;
  matchPercentage: number;
}

export interface Session {
  id: string;
  swapRequestId: string;
  teacherId: string;
  learnerId: string;
  teacher: User;
  learner: User;
  skill: Skill;
  date: string;
  time: string;
  duration: SessionDuration;
  status: SessionStatus;
  meetingLink: string;
  objectives: string[];
  notes?: string;
  completedAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  fromUser?: User;
}

export interface Review {
  id: string;
  sessionId: string;
  reviewerId: string;
  revieweeId: string;
  reviewer: User;
  reviewee: User;
  teachingQuality: number;
  communication: number;
  knowledge: number;
  punctuality: number;
  overallExperience: number;
  comment: string;
  createdAt: string;
  skill: Skill;
}

export interface ProgressStats {
  totalLearningHours: number;
  totalTeachingHours: number;
  completedSessions: number;
  skillsLearned: number;
  skillsTaught: number;
  activeSwaps: number;
  averageRating: number;
  streak: number;
}

export interface LearningEntry {
  id: string;
  skillId: string;
  skill: Skill;
  hoursCompleted: number;
  sessions: number;
  startDate: string;
  lastSessionDate: string;
  progress: number;
}

