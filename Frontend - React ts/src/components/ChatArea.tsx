
import React, { useState } from "react";
import { User, Conversation, Message } from "../types";
import ConversationHeader from "./ConversationHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import MessageHistory from "./MessageHistory";

interface ChatAreaProps {
  currentUser: User;
  currentConversation: Conversation;
  conversationMessages: Message[];
  onDecryptMessage: (messageId: string) => void;
  onSendMessage: (messageData: {
    receiverId: string | null;
    content: string;
    groupId?: string;
  }) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  currentUser,
  currentConversation,
  conversationMessages,
  onDecryptMessage,
  onSendMessage
}) => {
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="flex-1 flex flex-col">
      <ConversationHeader
        currentConversation={currentConversation}
        currentUser={currentUser}
        onShowHistory={toggleHistory}
      />
      <MessageList
        messages={conversationMessages}
        currentUser={currentUser}
        currentConversation={currentConversation}
        onDecryptMessage={onDecryptMessage}
      />
      <MessageInput
        currentUser={currentUser}
        currentConversation={currentConversation}
        onSendMessage={onSendMessage}
      />
      
      {showHistory && (
        <MessageHistory
          currentUser={currentUser}
          currentConversation={currentConversation}
          messages={conversationMessages}
          onClose={toggleHistory}
        />
      )}
    </div>
  );
};

export default ChatArea;
