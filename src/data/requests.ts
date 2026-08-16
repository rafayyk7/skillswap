import type { SwapRequest } from "@/types";
import { mockUsers, currentUser } from "./users";
import { skills } from "./skills";

export const mockRequests: SwapRequest[] = [
  {
    id: "req1",
    fromUserId: "u2",
    toUserId: "current",
    fromUser: mockUsers[1],
    toUser: currentUser,
    teachSkill: skills[0], // Alex teaches React
    learnSkill: skills[2], // Alex wants to learn Figma
    status: "pending",
    message: "Hey Alex! I'd love to do a React ↔ Figma swap. I've been teaching React for 4 years and your Figma skills look amazing. I think we'd be a great match!",
    proposedDays: ["tuesday", "thursday"],
    proposedTime: "19:00",
    sessionDuration: 90,
    createdAt: "2024-12-18T10:30:00Z",
    updatedAt: "2024-12-18T10:30:00Z",
    matchPercentage: 98,
  },
  {
    id: "req2",
    fromUserId: "u4",
    toUserId: "current",
    fromUser: mockUsers[3],
    toUser: currentUser,
    teachSkill: skills[1], // Kai teaches Python
    learnSkill: skills[2], // Kai wants Figma
    status: "pending",
    message: "Hi! Your Figma profile is impressive. I'd love to exchange — Python for Figma. I work in data science and can teach you practical ML-focused Python.",
    proposedDays: ["wednesday", "sunday"],
    proposedTime: "20:00",
    sessionDuration: 60,
    createdAt: "2024-12-17T15:00:00Z",
    updatedAt: "2024-12-17T15:00:00Z",
    matchPercentage: 87,
  },
  {
    id: "req3",
    fromUserId: "current",
    toUserId: "u3",
    fromUser: currentUser,
    toUser: mockUsers[2],
    teachSkill: skills[8], // Current user teaches TypeScript
    learnSkill: skills[3], // Current user wants Video Editing
    status: "pending",
    message: "Hi Mia! Your video editing portfolio is incredible. I'd love to learn from you. In exchange I can teach TypeScript — useful for any web projects you have.",
    proposedDays: ["monday", "wednesday"],
    proposedTime: "18:00",
    sessionDuration: 60,
    createdAt: "2024-12-16T09:00:00Z",
    updatedAt: "2024-12-16T09:00:00Z",
    matchPercentage: 82,
  },
  {
    id: "req4",
    fromUserId: "current",
    toUserId: "u5",
    fromUser: currentUser,
    toUser: mockUsers[4],
    teachSkill: skills[2], // Current user teaches Figma
    learnSkill: skills[4], // Current user wants Spanish
    status: "accepted",
    message: "Lena! I'd love to learn Spanish from you. I can teach Figma and UI/UX design in return. ¡Vamos!",
    proposedDays: ["saturday"],
    proposedTime: "11:00",
    sessionDuration: 60,
    createdAt: "2024-12-10T08:00:00Z",
    updatedAt: "2024-12-11T12:00:00Z",
    matchPercentage: 75,
  },
  {
    id: "req5",
    fromUserId: "u1",
    toUserId: "current",
    fromUser: mockUsers[0],
    toUser: currentUser,
    teachSkill: skills[16], // Sarah teaches Graphic Design
    learnSkill: skills[8], // Sarah wants TypeScript
    status: "accepted",
    message: "Hey! Let's swap — Graphic Design for TypeScript? I've been wanting to learn TypeScript for a project and your profile looks great.",
    proposedDays: ["friday"],
    proposedTime: "19:00",
    sessionDuration: 60,
    createdAt: "2024-12-05T16:00:00Z",
    updatedAt: "2024-12-06T10:00:00Z",
    matchPercentage: 91,
  },
  {
    id: "req6",
    fromUserId: "current",
    toUserId: "u6",
    fromUser: currentUser,
    toUser: mockUsers[5],
    teachSkill: skills[2], // Current user teaches Figma
    learnSkill: skills[15], // Current user wants Fitness
    status: "declined",
    message: "Marco, I'd love to learn fitness training from you. I can help you design your app UI in Figma.",
    proposedDays: ["tuesday", "thursday"],
    proposedTime: "07:30",
    sessionDuration: 60,
    createdAt: "2024-12-01T06:00:00Z",
    updatedAt: "2024-12-02T09:00:00Z",
    matchPercentage: 79,
  },
];
