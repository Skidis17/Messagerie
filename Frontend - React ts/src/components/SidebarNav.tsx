import React from "react";
import { User, Conversation } from "../types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Shield, User as UserIcon } from "lucide-react";
import UserMenuDropdown from "./UserMenuDropdown";
import NewConversationDialog from "./NewConversationDialog";
import CreateGroupDialog from "./CreateGroupDialog";
import NotificationButton from "./NotificationButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarNavProps {
  currentUser: User;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateConversation: (selectedUser: User) => void;
  onCreateGroup: (group: any) => void;
  onLogout?: () => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({
  currentUser,
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateConversation,
  onCreateGroup,
  onLogout
}) => {
  // Sort conversations by latest message date
  const sortedConversations = [...conversations].sort((a, b) => {
    const dateA = a.lastMessage ? new Date(a.lastMessage.date_envoi).getTime() : 0;
    const dateB = b.lastMessage ? new Date(b.lastMessage.date_envoi).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="w-80 bg-sidebar h-screen flex flex-col border-r border-sidebar-border text-sidebar-foreground overflow-hidden">
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-sidebar-primary" />
          <h1 className="font-bold text-lg">COMM-SEC</h1>
        </div>
        <div className="flex items-center space-x-2">
          <NotificationButton currentUserId={String(currentUser.id)} />
          {onLogout && <UserMenuDropdown currentUser={currentUser} onLogout={onLogout} />}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <NewConversationDialog currentUser={currentUser} onCreateConversation={onCreateConversation} />
        <CreateGroupDialog currentUser={currentUser} onCreateGroup={onCreateGroup} />
        <div className="mt-2">
          {sortedConversations.length === 0 ? (
            <div className="text-center text-sm text-sidebar-foreground/60 mt-8">
              Aucune conversation
            </div>
          ) : (
            sortedConversations.map((conversation) => {
              // Get display name
              let displayName = "Utilisateur inconnu";
              let avatarUrl = undefined;
              if (conversation.isGroup && conversation.groupDetails) {
                displayName = conversation.groupDetails.name;
              } else if (conversation.otherUser) {
                displayName = conversation.otherUser.nom;
                avatarUrl = conversation.otherUser.avatarUrl;
              } else if (conversation.lastMessage) {
                // Fallback: get the other user from lastMessage
                const { expediteur, destinataire } = conversation.lastMessage;
                if (expediteur.id !== currentUser.id) {
                  displayName = expediteur.nom;
                  avatarUrl = expediteur.avatarUrl;
                } else if (destinataire && destinataire.id !== currentUser.id) {
                  displayName = destinataire.nom;
                  avatarUrl = destinataire.avatarUrl;
                }
              }

              // Get last message
              const lastMsg = conversation.lastMessage;
              let lastMsgText = lastMsg ? lastMsg.contenu : "";
              let lastMsgTime = "";
              if (lastMsg && lastMsg.date_envoi) {
                const dateObj = new Date(lastMsg.date_envoi);
                if (!isNaN(dateObj.getTime())) {
                  lastMsgTime = formatDistanceToNow(dateObj, { addSuffix: true, locale: fr });
                }
              }

              return (
                <div
                  key={conversation.id}
                  className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                    activeConversationId === conversation.id
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex-shrink-0 mr-3">
                    {conversation.isGroup ? (
                      <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center">
                        <Shield className="h-5 w-5 text-sidebar-accent-foreground" />
                      </div>
                    ) : (
                      <Avatar className="h-9 w-9">
                        <AvatarImage 
                          src={avatarUrl}
                          alt={displayName} 
                        />
                        <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                          {displayName.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{displayName}</div>
                    <div className="text-xs text-sidebar-foreground/70 truncate">
                      {lastMsgText}
                    </div>
                  </div>
                  <div className="ml-2 flex flex-col items-end">
                    {lastMsgTime && (
                      <span className="text-xs text-sidebar-foreground/50">{lastMsgTime}</span>
                    )}
                    {conversation.unreadCount > 0 && (
                      <Badge className="mt-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
