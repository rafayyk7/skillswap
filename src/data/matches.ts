import type { Match } from "@/types";
import { mockUsers } from "./users";
import { skills } from "./skills";

export const mockMatches: Match[] = [
  {
    userId: "u2",
    user: mockUsers[1], // Alex Rodriguez
    matchPercentage: 98,
    teachingSkill: skills[0], // React
    learningSkill: skills[2], // Figma
    commonLanguages: ["English"],
    compatibilityReasons: [
      "Perfect skill match — you teach Figma, they need Figma",
      "They teach React — exactly what you want to learn",
      "Overlapping availability on weekends",
      "Similar experience levels",
    ],
  },
  {
    userId: "u4",
    user: mockUsers[3], // Kai Nakamura
    matchPercentage: 87,
    teachingSkill: skills[1], // Python
    learningSkill: skills[2], // Figma
    commonLanguages: ["English"],
    compatibilityReasons: [
      "They can teach Python — on your learning list",
      "You can teach Figma — on their learning list",
      "Both available on weekends",
    ],
  },
  {
    userId: "u3",
    user: mockUsers[2], // Mia Thompson
    matchPercentage: 82,
    teachingSkill: skills[3], // Video Editing
    learningSkill: skills[8], // TypeScript
    commonLanguages: ["English"],
    compatibilityReasons: [
      "They want to learn TypeScript — you teach it",
      "You can learn Video Editing from them",
      "Flexible evening schedules",
    ],
  },
  {
    userId: "u1",
    user: mockUsers[0], // Sarah Chen
    matchPercentage: 91,
    teachingSkill: skills[2], // Figma (but current user teaches Figma too — different angle)
    learningSkill: skills[16], // Graphic Design
    commonLanguages: ["English"],
    compatibilityReasons: [
      "Complementary design perspectives",
      "You teach TypeScript — they want to add it",
      "Overlapping online times",
    ],
  },
  {
    userId: "u5",
    user: mockUsers[4], // Lena Müller
    matchPercentage: 75,
    teachingSkill: skills[4], // Spanish
    learningSkill: skills[8], // TypeScript
    commonLanguages: ["English"],
    compatibilityReasons: [
      "They teach Spanish — great personal growth skill",
      "You teach TypeScript — they want Python/tech skills",
      "Daytime availability overlaps",
    ],
  },
  {
    userId: "u6",
    user: mockUsers[5], // Marco Santos
    matchPercentage: 79,
    teachingSkill: skills[15], // Fitness
    learningSkill: skills[2], // Figma
    commonLanguages: ["English"],
    compatibilityReasons: [
      "They teach Fitness — great life skill",
      "You teach Figma — they need it for their app",
      "Similar session duration preference",
    ],
  },
];
