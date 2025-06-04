export type UserRole = "soldat" | "commandant";

export interface User {
  id: number;
  code: string;         
  nom: string;          
  password: string;    
  role: UserRole;
  // Remove grade and avatarUrl if not used or definitely not returned by backend
  grade?: string;       // optional, only if backend adds it later
  avatarUrl?: string;   // optional, only if you have avatar URLs
}

export type EncryptionType = 
  | "soldier-to-soldier" 
  | "commander-to-soldier" 
  | "soldier-commander"
  | "commander-commander" 
  | "group-cipher";

export interface Message {
  id: string;
  senderId: string;
  receiverId: string | null; // null for group messages
  groupId?: string;
  content: string;
  encryptedContent: string;
  isDecrypted: boolean;
  encryptionType: EncryptionType;
  timestamp: number;
  metadata?: MessageMetadata; // New field for decorator pattern
}

// New interface for message metadata (used by decorators)
export interface MessageMetadata {
  timestampAdded?: boolean;
  processedAt?: number;
  signature?: string;
  signatureAdded?: boolean;
  compressed?: boolean;
  compressionRatio?: number;
  [key: string]: any; // Allow additional metadata
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  members: number[]; // User IDs
  commanderId: number;
  missionCode?: string;
}

export interface Conversation {
  id: string;
  participants: number[]; // User IDs
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupDetails?: Group;
  otherUser?: User; // For 1:1 conversations
}

export interface CreateGroupPayload {
    name: string;
    description: string;
    code: string;
    members: number[];
}

export interface SendMessagePayload {
    contenu: string;
    destinataireId: number;
    type: MessageType;
}

export interface SendGroupMessagePayload {
    contenu: string;
} 