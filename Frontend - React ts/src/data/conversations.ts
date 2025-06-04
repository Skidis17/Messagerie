
import { Conversation } from "../types";
import { messages } from "./messages";
import { groups } from "./groups";

export const conversations: Conversation[] = [
  {
    id: "conv1",
    participants: ["user1", "user3"],
    lastMessage: messages.find(msg => 
      (msg.senderId === "user1" && msg.receiverId === "user3") || 
      (msg.senderId === "user3" && msg.receiverId === "user1")
    ),
    unreadCount: 0,
    isGroup: false
  },
  {
    id: "conv2",
    participants: ["user2", "user5"],
    lastMessage: messages.find(msg => 
      (msg.senderId === "user2" && msg.receiverId === "user5") || 
      (msg.senderId === "user5" && msg.receiverId === "user2")
    ),
    unreadCount: 1,
    isGroup: false
  },
  {
    id: "conv3",
    participants: ["user1", "user2", "user3", "user4"],
    lastMessage: messages.find(msg => msg.groupId === "group1"),
    unreadCount: 2,
    isGroup: true,
    groupDetails: groups.find(g => g.id === "group1")
  },
  {
    id: "conv4",
    participants: ["user2", "user3", "user5"],
    lastMessage: messages.find(msg => msg.groupId === "group2"),
    unreadCount: 1,
    isGroup: true,
    groupDetails: groups.find(g => g.id === "group2")
  }
];

// TODO: API INTEGRATION POINT - FETCH CONVERSATIONS
// GET /api/conversations?userId=${currentUserId}
// Should return: Conversation[]

// TODO: API INTEGRATION POINT - CREATE CONVERSATION
// POST /api/conversations
// Body: { participants: [userId1, userId2], isGroup: false }
// Should return: Conversation

// TODO: API INTEGRATION POINT - MARK CONVERSATION AS READ
// PUT /api/conversations/${conversationId}/mark-read
// Body: { userId: currentUserId }
// Should return: { success: boolean }
