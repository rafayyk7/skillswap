import type { Conversation, Message } from "@/types";
import { mockUsers, currentUser } from "./users";

export const mockMessages: Record<string, Message[]> = {
  conv1: [
    {
      id: "m1",
      conversationId: "conv1",
      senderId: "u2",
      content: "Hey Alex! Just sent you a swap request. React for Figma sounds like a perfect deal 🤝",
      timestamp: "2024-12-18T10:31:00Z",
      read: true,
    },
    {
      id: "m2",
      conversationId: "conv1",
      senderId: "current",
      content: "Hey Alex! I saw your request. Your React portfolio is really impressive. I'd love to do this swap!",
      timestamp: "2024-12-18T11:05:00Z",
      read: true,
    },
    {
      id: "m3",
      conversationId: "conv1",
      senderId: "u2",
      content: "Awesome! When would you like to start? I'm free Tuesday and Thursday evenings.",
      timestamp: "2024-12-18T11:10:00Z",
      read: true,
    },
    {
      id: "m4",
      conversationId: "conv1",
      senderId: "current",
      content: "Tuesday works great for me. Shall we do 7pm your time?",
      timestamp: "2024-12-18T11:15:00Z",
      read: true,
    },
    {
      id: "m5",
      conversationId: "conv1",
      senderId: "u2",
      content: "Perfect! I'll send a calendar invite. Looking forward to it! 🚀",
      timestamp: "2024-12-18T11:20:00Z",
      read: false,
    },
  ],
  conv2: [
    {
      id: "m6",
      conversationId: "conv2",
      senderId: "u5",
      content: "¡Hola Alex! So excited to start our Spanish/Figma swap! I've prepared some materials for our first session.",
      timestamp: "2024-12-11T14:00:00Z",
      read: true,
    },
    {
      id: "m7",
      conversationId: "conv2",
      senderId: "current",
      content: "¡Hola Lena! ¡Qué emocionante! I'm so ready to start learning. I've been practicing the alphabet 😄",
      timestamp: "2024-12-11T14:30:00Z",
      read: true,
    },
    {
      id: "m8",
      conversationId: "conv2",
      senderId: "u5",
      content: "Haha that's great! See you Saturday at 11am. I'll set up a shared Google Doc for vocabulary.",
      timestamp: "2024-12-11T15:00:00Z",
      read: true,
    },
    {
      id: "m9",
      conversationId: "conv2",
      senderId: "u5",
      content: "Don't forget — our session is tomorrow! Are you still available?",
      timestamp: "2024-12-27T09:00:00Z",
      read: false,
    },
  ],
  conv3: [
    {
      id: "m10",
      conversationId: "conv3",
      senderId: "u1",
      content: "Hi Alex! Thank you for the TypeScript session last week. It was really helpful!",
      timestamp: "2024-12-21T10:00:00Z",
      read: true,
    },
    {
      id: "m11",
      conversationId: "conv3",
      senderId: "current",
      content: "So glad it helped Sarah! You picked it up really quickly. Ready for Graphic Design on Friday?",
      timestamp: "2024-12-21T10:30:00Z",
      read: true,
    },
    {
      id: "m12",
      conversationId: "conv3",
      senderId: "u1",
      content: "Absolutely! I'm going to show you some typography exercises and we'll do a mini brand project together.",
      timestamp: "2024-12-21T11:00:00Z",
      read: true,
    },
    {
      id: "m13",
      conversationId: "conv3",
      senderId: "u1",
      content: "Also — I left you a review on the platform. 5 stars, well deserved! ⭐⭐⭐⭐⭐",
      timestamp: "2024-12-21T11:05:00Z",
      read: false,
    },
  ],
};

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participants: [currentUser, mockUsers[1]],
    lastMessage: mockMessages.conv1[4],
    unreadCount: 1,
    updatedAt: "2024-12-18T11:20:00Z",
  },
  {
    id: "conv2",
    participants: [currentUser, mockUsers[4]],
    lastMessage: mockMessages.conv2[3],
    unreadCount: 1,
    updatedAt: "2024-12-27T09:00:00Z",
  },
  {
    id: "conv3",
    participants: [currentUser, mockUsers[0]],
    lastMessage: mockMessages.conv3[3],
    unreadCount: 1,
    updatedAt: "2024-12-21T11:05:00Z",
  },
];
