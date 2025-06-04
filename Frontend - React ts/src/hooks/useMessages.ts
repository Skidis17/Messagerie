import { User, Message, Conversation, MessageType } from "../types";
import { api } from "../services/api";
import { toast } from "@/hooks/use-toast";
import { users } from "../data/mockData";

export const useMessages = (
  currentUser: User,
  onAddMessage: (message: Partial<Message>) => void,
  onUpdateMessage?: (messageId: number, updates: Partial<Message>) => void
) => {
  const decryptMessage = async (messageId: string, currentConversation?: Conversation) => {
    let decryptionKey = "";
    
    if (currentConversation?.isGroup && currentConversation.groupDetails) {
      decryptionKey = currentConversation.groupDetails.missionCode || "";
    }
    
    try {
      const messageToDecrypt = messageService.getMessageById?.(messageId);
      if (!messageToDecrypt) return;
      
      const decryptedContent = messageService.decryptMessage(messageToDecrypt, decryptionKey);
      
      onUpdateMessage(messageId, { 
        isDecrypted: true, 
        content: decryptedContent 
      });
      
      toast({
        title: "Message déchiffré",
        description: "Le message a été déchiffré avec succès",
        variant: "default",
      });
    } catch (error) {
      console.error('Error decrypting message:', error);
      toast({
        title: "Erreur de déchiffrement",
        description: "Impossible de déchiffrer le message",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (messageData: {
    receiverId: string | null;
    content: string;
    groupId?: string;
  }, currentConversation?: Conversation) => {
    const { receiverId, content, groupId } = messageData;
    
    // Get receiver info for proper encryption strategy
    let receiverUser = receiverId ? users.find(u => u.id === receiverId) : null;
    
    // Determine encryption type based on roles - this will be overridden by MessageService
    let encryptionType;
    if (groupId) {
      encryptionType = "group-cipher";
    } else if (currentUser.role === "commander" && receiverUser?.role === "soldier") {
      encryptionType = "commander-to-soldier";
    } else if (currentUser.role === "soldier" && receiverUser?.role === "commander") {
      encryptionType = "soldier-commander";
    } else if (currentUser.role === "commander" && receiverUser?.role === "commander") {
      encryptionType = "commander-commander";
    } else {
      encryptionType = "soldier-to-soldier";
    }

    try {
      // Create message with proper role information
      const newMessage = messageService.createMessage(
        currentUser.id,
        receiverId,
        content,
        encryptionType as any, // Will be properly typed by MessageService
        groupId,
        currentUser.role, // sender role
        receiverUser?.role // receiver role
      );

      onAddMessage(newMessage);

      if (groupId) {
        messageService.sendGroupMessage(newMessage, currentUser.name);
      } else if (receiverId) {
        if (receiverUser) {
          messageService.sendDirectMessage(newMessage, currentUser.name, receiverUser.name);
        }
      }

      messageService.sendMessageToBackend(newMessage);

      toast({
        title: "Message envoyé",
        description: "Le message a été envoyé avec succès",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le message."
      });
      throw error;
    }
  };

  const decryptMessage = async (messageId: string, conversation?: Conversation) => {
    try {
      // TODO: Implement actual decryption logic
      if (onUpdateMessage) {
        onUpdateMessage(Number(messageId), {
          contenu: "Message déchiffré: [Contenu protégé]"
        });
      }
      
      toast({
        title: "Message déchiffré",
        description: "Le message a été déchiffré avec succès",
      });
    } catch (error) {
      console.error('Error decrypting message:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de déchiffrer le message."
      });
    }
  };

  return {
    sendMessage,
    decryptMessage
  };
};
