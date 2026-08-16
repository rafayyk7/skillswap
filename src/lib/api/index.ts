/**
 * API Service Layer
 * 
 * This module provides a clean abstraction over data fetching.
 * Currently uses mock data — swap these implementations for real API calls
 * when the backend is ready (replace with fetch/axios calls to your REST API).
 */

import { mockUsers, currentUser } from "@/data/users";
import { skills, skillCategories } from "@/data/skills";
import { mockMatches } from "@/data/matches";
import { mockRequests } from "@/data/requests";
import { mockSessions } from "@/data/sessions";
import { mockConversations, mockMessages } from "@/data/messages";
import { mockNotifications } from "@/data/notifications";
import { mockReviews } from "@/data/reviews";
import { mockProgressStats, mockLearningEntries } from "@/data/progress";
import type {
  User,
  Skill,
  SkillCategory,
  Match,
  SwapRequest,
  Session,
  Conversation,
  Message,
  Notification,
  Review,
  ProgressStats,
  LearningEntry,
} from "@/types";

// Simulate async API calls
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    await delay(100);
    return currentUser;
  },
  getUser: async (username: string): Promise<User | undefined> => {
    await delay(200);
    return mockUsers.find((u) => u.username === username) ?? currentUser;
  },
  getAllUsers: async (): Promise<User[]> => {
    await delay(300);
    return mockUsers;
  },
};

export const skillService = {
  getSkills: async (): Promise<Skill[]> => {
    await delay(200);
    return skills;
  },
  getCategories: async (): Promise<SkillCategory[]> => {
    await delay(100);
    return skillCategories;
  },
};

export const matchService = {
  getMatches: async (): Promise<Match[]> => {
    await delay(400);
    return mockMatches;
  },
};

export const requestService = {
  getRequests: async (): Promise<SwapRequest[]> => {
    await delay(300);
    return mockRequests;
  },
  sendRequest: async (data: Partial<SwapRequest>): Promise<SwapRequest> => {
    await delay(500);
    // Mock create
    return { ...mockRequests[0], ...data, id: `req_${Date.now()}` };
  },
};

export const sessionService = {
  getSessions: async (): Promise<Session[]> => {
    await delay(300);
    return mockSessions;
  },
  getSession: async (id: string): Promise<Session | undefined> => {
    await delay(200);
    return mockSessions.find((s) => s.id === id);
  },
};

export const messagingService = {
  getConversations: async (): Promise<Conversation[]> => {
    await delay(300);
    return mockConversations;
  },
  getMessages: async (conversationId: string): Promise<Message[]> => {
    await delay(200);
    return mockMessages[conversationId] ?? [];
  },
};

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    await delay(200);
    return mockNotifications;
  },
};

export const reviewService = {
  getReviews: async (userId?: string): Promise<Review[]> => {
    await delay(200);
    if (userId) return mockReviews.filter((r) => r.revieweeId === userId);
    return mockReviews;
  },
};

export const progressService = {
  getStats: async (): Promise<ProgressStats> => {
    await delay(200);
    return mockProgressStats;
  },
  getLearningHistory: async (): Promise<LearningEntry[]> => {
    await delay(200);
    return mockLearningEntries;
  },
};

