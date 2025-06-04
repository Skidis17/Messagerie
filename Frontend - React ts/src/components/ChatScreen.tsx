import React from "react";
import { User } from "../types";
import { useConversations } from "../hooks/useConversations";
import { useMessages } from "../hooks/useMessages";
import { useMobileSidebar } from "../hooks/useMobileSidebar";
import SidebarContainer from "./SidebarContainer";
import MobileHeader from "./MobileHeader";
import ChatArea from "./ChatArea";  

interface ChatScreenProps {
  currentUser: User;
  onLogout: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ currentUser, onLogout }) => {
  const {
    conversations,
    activeConversationId,
    currentConversation,
    conversationMessages,
    selectConversation,
    createConversation,
    createGroup,
    addMessage,
    updateMessage
  } = useConversations(currentUser);

  const { mobileSidebarOpen, toggleMobileSidebar, closeMobileSidebar } = useMobileSidebar();

  const { decryptMessage, sendMessage } = useMessages(currentUser, addMessage, updateMessage);

  const handleDecryptMessage = (messageId: string) => {
    decryptMessage(messageId, currentConversation);
  };

  const handleSendMessage = (messageData: {
    receiverId: string | null;
    content: string;
    groupId?: string;
  }) => {
    sendMessage(messageData, currentConversation);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-military-light/30">
      <MobileHeader onToggleSidebar={toggleMobileSidebar} />
      
      <SidebarContainer
        currentUser={currentUser}
        conversations={conversations}
        activeConversationId={activeConversationId}
        mobileSidebarOpen={mobileSidebarOpen}
        onSelectConversation={selectConversation}
        onCreateConversation={createConversation}
        onCreateGroup={createGroup}
        onCloseMobileSidebar={closeMobileSidebar}
        onLogout={onLogout}
      />
      
      {currentConversation ? (
        <ChatArea
          currentUser={currentUser}
          currentConversation={currentConversation}
          conversationMessages={conversationMessages}
          onDecryptMessage={handleDecryptMessage}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-military-grey">Sélectionnez une conversation</p>
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
