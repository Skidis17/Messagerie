
import React from "react";
import { User, Conversation } from "../types";
import SidebarNav from "./SidebarNav";

interface SidebarContainerProps {
  currentUser: User;
  conversations: Conversation[];
  activeConversationId: string | null;
  mobileSidebarOpen: boolean;
  onSelectConversation: (id: string) => void;
  onCreateConversation: (selectedUser: User) => void;
  onCreateGroup: (group: any) => void;
  onCloseMobileSidebar: () => void;
  onLogout: () => void;
}

const SidebarContainer: React.FC<SidebarContainerProps> = ({
  currentUser,
  conversations,
  activeConversationId,
  mobileSidebarOpen,
  onSelectConversation,
  onCreateConversation,
  onCreateGroup,
  onCloseMobileSidebar,
  onLogout
}) => {
  const handleSelectConversation = (conversationId: string) => {
    onSelectConversation(conversationId);
    onCloseMobileSidebar();
  };

  const handleCreateConversation = (selectedUser: User) => {
    onCreateConversation(selectedUser);
    onCloseMobileSidebar();
  };

  const handleCreateGroup = (group: any) => {
    onCreateGroup(group);
    onCloseMobileSidebar();
  };

  return (
    <div className={`${
      mobileSidebarOpen ? 'fixed inset-0 z-40 block' : 'hidden'
    } md:relative md:block`}>
      <SidebarNav
        currentUser={currentUser}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onCreateConversation={handleCreateConversation}
        onCreateGroup={handleCreateGroup}
        onLogout={onLogout}
      />
      
      {mobileSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30" 
          onClick={onCloseMobileSidebar}
        />
      )}
    </div>
  );
};

export default SidebarContainer;
