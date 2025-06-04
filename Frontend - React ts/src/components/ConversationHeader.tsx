
import React, { useState } from "react";
import { User, Conversation } from "../types";
import { users } from "../data/mockData";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Users, 
  User as UserIcon, 
  FileText, 
  Bell, 
  Info,
  X,
  History
} from "lucide-react";

interface ConversationHeaderProps {
  currentConversation: Conversation;
  currentUser: User;
  onShowHistory: () => void;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  currentConversation,
  currentUser,
  onShowHistory
}) => {
  const [showMissionDetails, setShowMissionDetails] = useState(false);
  
  const isGroup = currentConversation.isGroup;
  let name = "";
  let subtitle = "";
  let icon = <UserIcon className="h-5 w-5" />;

  if (isGroup && currentConversation.groupDetails) {
    name = currentConversation.groupDetails.name;
    subtitle = `Mission: ${currentConversation.groupDetails.missionCode || "N/A"}`;
    icon = <Users className="h-5 w-5" />;

    // Pour les groupes, calculer le nombre de membres
    const memberCount = currentConversation.participants.length;
    subtitle = `${memberCount} membres · ${subtitle}`;
  } else {
    // Pour les conversations individuelles, obtenir l'autre utilisateur
    const otherUserId = currentConversation.participants.find(
      (id) => id !== currentUser.id
    );
    const otherUser = users.find((user) => user.id === otherUserId);

    if (otherUser) {
      name = `${otherUser.rank} ${otherUser.name}`;
      subtitle = otherUser.role === "commander" ? "Commandant" : "Soldat";
      icon = otherUser.role === "commander" ? (
        <Shield className="h-5 w-5" />
      ) : (
        <UserIcon className="h-5 w-5" />
      );
    }
  }

  return (
    <>
      <div className="p-4 border-b border-gray-200 bg-military-light flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-military-olive flex items-center justify-center text-white mr-3">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-military-dark">{name}</h3>
            <p className="text-xs text-military-grey">{subtitle}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          {isGroup && (
            <Button
              variant="ghost"
              size="sm"
              className="text-military-grey"
              onClick={() => setShowMissionDetails(!showMissionDetails)}
            >
              <Info className="h-4 w-4" />
              <span className="ml-1 hidden md:inline">Détails</span>
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="text-military-grey"
            onClick={onShowHistory}
          >
            <History className="h-4 w-4" />
            <span className="ml-1 hidden md:inline">Historique</span>
          </Button>
          
          {isGroup && (
            <Button
              variant="ghost"
              size="sm"
              className="text-military-grey"
            >
              <Bell className="h-4 w-4" />
              <span className="ml-1 hidden md:inline">Alertes</span>
            </Button>
          )}
        </div>
      </div>

      {showMissionDetails && isGroup && currentConversation.groupDetails && (
        <div className="p-4 bg-military-dark/10 border-b border-gray-200 relative">
          <Button 
            variant="ghost" 
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0" 
            onClick={() => setShowMissionDetails(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <h4 className="font-bold mb-2">Détails de la Mission</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="mb-1"><span className="font-semibold">Nom:</span> {currentConversation.groupDetails.name}</p>
              <p className="mb-1"><span className="font-semibold">Code:</span> {currentConversation.groupDetails.missionCode}</p>
              <p><span className="font-semibold">Commandant:</span> {
                users.find(u => u.id === currentConversation.groupDetails?.commanderId)?.rank
              } {
                users.find(u => u.id === currentConversation.groupDetails?.commanderId)?.name
              }</p>
            </div>
            
            <div>
              <p className="font-semibold mb-1">Description:</p>
              <p className="text-military-grey text-xs">
                {currentConversation.groupDetails.description || "Aucune description disponible"}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <h5 className="font-semibold mb-1">Membres:</h5>
            <div className="flex flex-wrap gap-1">
              {currentConversation.participants.map(participantId => {
                const participant = users.find(u => u.id === participantId);
                return participant ? (
                  <div 
                    key={participantId}
                    className="bg-military-olive/20 px-2 py-1 rounded-md text-xs"
                  >
                    {participant.rank} {participant.name}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConversationHeader;
