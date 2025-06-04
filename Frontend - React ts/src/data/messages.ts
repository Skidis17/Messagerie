
import { Message, EncryptionType } from "../types";
import { mockEncrypt } from "../utils/mockEncryption";
import { users } from "./users";

export const messages: Message[] = [
  {
    id: "msg1",
    senderId: "user1",
    receiverId: "user3",
    content: "Rapport de situation requis immédiatement",
    encryptedContent: mockEncrypt("Rapport de situation requis immédiatement", "commander-to-soldier"),
    isDecrypted: false,
    encryptionType: "commander-to-soldier",
    timestamp: Date.now() - 86400000
  },
  {
    id: "msg2",
    senderId: "user3",
    receiverId: "user1",
    content: "Situation stable. Aucune activité suspecte détectée.",
    encryptedContent: mockEncrypt("Situation stable. Aucune activité suspecte détectée.", "soldier-to-soldier"),
    isDecrypted: false,
    encryptionType: "soldier-to-soldier",
    timestamp: Date.now() - 82800000
  },
  {
    id: "msg3",
    senderId: "user1",
    receiverId: null,
    groupId: "group1",
    content: "Briefing à 0800 - Préparez vos rapports",
    encryptedContent: mockEncrypt("Briefing à 0800 - Préparez vos rapports", "commander-to-group"),
    isDecrypted: false,
    encryptionType: "commander-to-group",
    timestamp: Date.now() - 43200000
  },
  {
    id: "msg4",
    senderId: "user2",
    receiverId: "user5",
    content: "Confirmation de vos coordonnées actuelles?",
    encryptedContent: mockEncrypt("Confirmation de vos coordonnées actuelles?", "commander-to-soldier"),
    isDecrypted: false,
    encryptionType: "commander-to-soldier",
    timestamp: Date.now() - 21600000
  },
  {
    id: "msg5",
    senderId: "user5",
    receiverId: "user2",
    content: "Coordonnées: Secteur B, Quadrant 7. RAS.",
    encryptedContent: mockEncrypt("Coordonnées: Secteur B, Quadrant 7. RAS.", "soldier-to-soldier"),
    isDecrypted: false,
    encryptionType: "soldier-to-soldier",
    timestamp: Date.now() - 18000000
  },
  {
    id: "msg6",
    senderId: "user2",
    receiverId: null,
    groupId: "group2",
    content: "Nouvelle mission: Reconnaissance du secteur Est. Détails à suivre.",
    encryptedContent: mockEncrypt("Nouvelle mission: Reconnaissance du secteur Est. Détails à suivre.", "commander-to-group"),
    isDecrypted: false,
    encryptionType: "commander-to-group",
    timestamp: Date.now() - 3600000
  }
];

// TODO: API INTEGRATION POINT - FETCH MESSAGES
// GET /api/messages?userId=${currentUserId}&conversationId=${conversationId}
// Should return: Message[]

// TODO: API INTEGRATION POINT - SEND MESSAGE
// POST /api/messages
// Body: { senderId, receiverId, content, encryptedContent, encryptionType, groupId? }
// Should return: Message

// Fonction pour générer un nouveau message
export function createNewMessage(
  senderId: string,
  receiverId: string | null, 
  content: string,
  groupId?: string
): Message {
  const sender = users.find(u => u.id === senderId);
  const receiver = receiverId ? users.find(u => u.id === receiverId) : null;
  
  let encryptionType: EncryptionType = "soldier-to-soldier";
  
  if (sender?.role === "commander" && receiver?.role === "soldier") {
    encryptionType = "commander-to-soldier";
  } else if (sender?.role === "commander" && groupId) {
    encryptionType = "commander-to-group";
  }
  
  return {
    id: `msg${Date.now()}`,
    senderId,
    receiverId,
    groupId,
    content,
    encryptedContent: mockEncrypt(content, encryptionType),
    isDecrypted: false,
    encryptionType,
    timestamp: Date.now()
  };
}
