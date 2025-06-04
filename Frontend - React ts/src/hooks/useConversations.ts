import { useState, useEffect, useRef } from "react";
import { User, Conversation, Message, Group } from "../types";
import { api } from "../services/api";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

// Helper to map backend message to frontend format
function mapBackendMessage(msg: any): Message {
  return {
    id: msg.id,
    contenu: msg.contenu,
    date_envoi: msg.date_envoi || msg.dateEnvoi || "",
    type: msg.type,
    expediteur: msg.expediteur,
    destinataire: msg.destinataire,
    group_id: msg.group_id ?? msg.groupId ?? null,
  };
}

export const useConversations = (currentUser: User) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const groupNotificationsSetup = useRef<Set<string>>(new Set());

  // Fetch user's conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        console.log('Fetching conversations...');
        const allMessages = await api.getConversations();
        console.log('Received messages:', allMessages);
        
        // Create a map to store unique conversations
        const conversationMap = new Map<number, Conversation>();
        
        // Process each message to build conversations
        const getUserId = (user: User | number): number => {
          if (typeof user === 'number') return user;
          return user.id;
        };

        allMessages.forEach(message => {
          if (message.type !== "groupe") {
            const otherUserId = getUserId(message.expediteur) === currentUser.id 
              ? getUserId(message.destinataire)
              : getUserId(message.expediteur);
              
            if (!conversationMap.has(otherUserId)) {
              conversationMap.set(otherUserId, {
                id: `conv-${otherUserId}`,
                participants: [currentUser.id, otherUserId],
                isGroup: false,
                unreadCount: 0,
                lastMessage: message
              });
            } else {
              // Update last message if this one is more recent
              const conv = conversationMap.get(otherUserId)!;
              if (!conv.lastMessage || new Date(message.date_envoi) > new Date(conv.lastMessage.date_envoi)) {
                conv.lastMessage = message;
              }
            }
          }
        });
        
        const conversationList = Array.from(conversationMap.values());
        console.log('Processed conversations:', conversationList);
        setConversations(conversationList);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        if (axios.isAxiosError(error)) {
          console.error('Response:', error.response?.data);
          console.error('Status:', error.response?.status);
        }
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les conversations."
        });
      }
    };

    fetchConversations();
  }, [currentUser.id]);

  // Fetch user's groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groups = await api.getGroups();
        
        // Convert groups to conversations
        const groupConversations: Conversation[] = groups.map(group => ({
          id: `group-${group.id}`,
          participants: group.members,
          isGroup: true,
          groupDetails: group,
          unreadCount: 0
        }));

        setConversations(prev => {
          const nonGroupConvs = prev.filter(conv => !conv.isGroup);
          return [...nonGroupConvs, ...groupConversations];
        });
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, [currentUser.id]);

  const selectConversation = async (conversationId: string) => {
    console.log('Selecting conversation:', conversationId);
    setActiveConversationId(conversationId);
    
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) {
      console.log('No conversation found for ID:', conversationId);
      return;
    }
    console.log('Found conversation:', conversation);

    try {
      let fetchedMessages: Message[] = [];
      if (conversation.isGroup) {
        const groupId = conversation.groupDetails?.id;
        if (groupId) {
          console.log('Fetching group messages for group:', groupId);
          fetchedMessages = (await api.getGroupMessages(groupId)).map(mapBackendMessage);
        }
      } else {
        // Extract numeric ID from conversation ID (format: conv-123)
        const otherUserId = Number(conversationId.split('-')[1]);
        if (!isNaN(otherUserId)) {
          console.log('Fetching conversation messages for user:', otherUserId);
          fetchedMessages = (await api.getConversationMessages(otherUserId)).map(mapBackendMessage);
        }
      }
      // Sort messages by date_envoi ascending (oldest to newest)
      fetchedMessages.sort((a, b) => new Date(a.date_envoi).getTime() - new Date(b.date_envoi).getTime());
      console.log('Fetched messages:', fetchedMessages);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les messages."
      });
    }
  };

  const createConversation = async (selectedUser: User) => {
    const conversationId = `conv-${selectedUser.id}`;
    const existingConversation = conversations.find(conv => conv.id === conversationId);

    if (existingConversation) {
      selectConversation(existingConversation.id);
      return;
    }

    // Create new conversation
    const newConversation: Conversation = {
      id: conversationId,
      participants: [currentUser.id, selectedUser.id],
      isGroup: false,
      unreadCount: 0
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  };

  const createGroup = async (group: Group) => {
    try {
      const newGroup = await api.createGroup({
        name: group.name,
        description: group.description || "",
        code: group.missionCode || "",
        members: group.members
      });

      const newConversation: Conversation = {
        id: `group-${newGroup.id}`,
        participants: newGroup.members,
        isGroup: true,
        groupDetails: newGroup,
        unreadCount: 0
      };

      setConversations(prev => [newConversation, ...prev]);
      setActiveConversationId(newConversation.id);
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le groupe."
      });
    }
  };

  const addMessage = async (newMessage: Partial<Message>) => {
    try {
      let sentMessage: Message;
      console.log('Adding new message:', newMessage);
      
      if (newMessage.group_id) {
        sentMessage = await api.sendGroupMessage(newMessage.group_id, {
          contenu: newMessage.contenu!
        });
      } else if (newMessage.destinataire) {
        const destinataireId = typeof newMessage.destinataire === 'object' 
          ? newMessage.destinataire.id 
          : newMessage.destinataire;

        sentMessage = await api.sendMessage({
          contenu: newMessage.contenu!,
          destinataireId,
          type: newMessage.type || 'soldat_to_soldat'
        });
      } else {
        throw new Error("Invalid message: must have either group_id or destinataire");
      }

      console.log('Message sent successfully:', sentMessage);

      // Immediately update messages state with the new message
      const mappedMessage = mapBackendMessage(sentMessage);
      setMessages(prev => [...prev, mappedMessage]);

      // Update conversation's last message
      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              lastMessage: mappedMessage,
              unreadCount: 0 // Reset unread count for current conversation
            };
          }
          return conv;
        })
      );

      toast({
        title: "Message envoyé",
        description: "Le message a été envoyé avec succès",
      });

      return mappedMessage;
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

  const updateMessage = (messageId: number, updates: Partial<Message>) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    );
  };

  const currentConversation = conversations.find(
    conv => conv.id === activeConversationId
  );

  const conversationMessages = messages.filter(msg => {
    if (!currentConversation) return false;
    
    if (currentConversation.isGroup) {
      return msg.group_id === currentConversation.groupDetails?.id;
    } else {
      const participants = currentConversation.participants;
      const expediteurId = typeof msg.expediteur === 'object' ? msg.expediteur.id : msg.expediteur;
      const destinataireId = msg.destinataire ? (typeof msg.destinataire === 'object' ? msg.destinataire.id : msg.destinataire) : 0;
      
      return participants.includes(expediteurId) && participants.includes(destinataireId);
    }
  });

  return {
    conversations,
    activeConversationId,
    currentConversation,
    conversationMessages,
    selectConversation,
    createConversation,
    createGroup,
    addMessage,
    updateMessage
  };
};
