import type { ProgressStats, LearningEntry } from "@/types";
import { skills } from "./skills";

export const mockProgressStats: ProgressStats = {
  totalLearningHours: 14,
  totalTeachingHours: 9,
  completedSessions: 8,
  skillsLearned: 3,
  skillsTaught: 2,
  activeSwaps: 2,
  averageRating: 4.7,
  streak: 5,
};

export const mockLearningEntries: LearningEntry[] = [
  {
    id: "le1",
    skillId: "s17",
    skill: skills[16],
    hoursCompleted: 6,
    sessions: 3,
    startDate: "2024-12-05",
    lastSessionDate: "2024-12-20",
    progress: 35,
  },
  {
    id: "le2",
    skillId: "s5",
    skill: skills[4],
    hoursCompleted: 4,
    sessions: 2,
    startDate: "2024-12-11",
    lastSessionDate: "2024-12-28",
    progress: 20,
  },
  {
    id: "le3",
    skillId: "s2",
    skill: skills[1],
    hoursCompleted: 4,
    sessions: 2,
    startDate: "2024-11-20",
    lastSessionDate: "2024-12-05",
    progress: 15,
  },
];
