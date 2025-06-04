
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User, Conversation } from "../types";
import { Send, Lock } from "lucide-react";

interface MessageInputProps {
  currentUser: User;
  currentConversation: Conversation;
  onSendMessage: (messageData: {
    receiverId: string | null;
    content: string;
    groupId?: string;
  }) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  currentUser,
  currentConversation,
  onSendMessage,
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const receiverId = currentConversation.isGroup 
      ? null 
      : currentConversation.participants.find(id => id !== currentUser.id) || null;
    
    const groupId = currentConversation.isGroup 
      ? currentConversation.groupDetails?.id 
      : undefined;

    onSendMessage({
      receiverId,
      content: message,
      groupId
    });

    setMessage("");
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-military-light/10">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <div className="flex items-center bg-white rounded-md border border-military-khaki/30 p-2">
          <Textarea
            placeholder="Tapez un message sécurisé..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 resize-none border-0 focus-visible:ring-0 p-0"
            rows={2}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-military-grey">
            <Lock className="h-3 w-3 mr-1" />
            <span>Message chiffré avec patterns de sécurité</span>
          </div>
          
          <Button 
            type="submit" 
            size="sm"
            className="bg-military-olive hover:bg-military-khaki text-white"
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4 mr-1" />
            Envoyer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
