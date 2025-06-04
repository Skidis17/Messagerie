import React, { useState, useRef, useEffect } from "react";
import { User, Message, Conversation } from "../types";
import { users } from "../data/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";
import { format } from "date-fns";
import { 
  BaseMessage, 
  TimestampDecorator, 
  DigitalSignatureDecorator,
  MessageComponent
} from "../decorators/MessageDecorator";

interface MessageListProps {
  messages: Message[];
  currentUser: User;
  currentConversation: Conversation;
  onDecryptMessage: (messageId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUser,
  currentConversation,
  onDecryptMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [decryptingId, setDecryptingId] = useState<string | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    // Add a small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Sort messages by date
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.date_envoi).getTime() - new Date(b.date_envoi).getTime()
  );

  const getEncryptionTypeLabel = (type: string, senderId: string, isGroup: boolean) => {
    const sender = users.find(u => u.id === senderId);
    
    if (isGroup || type === "group-cipher") {
      return "Chiffrement CIPHER (Groupe)";
    }
    
    switch (type) {
      case "commander-commander":
        return "Chiffrement RSA (Commandant → Commandant)";
      case "commander-to-soldier":
        return "Chiffrement AES (Commandant → Soldat)";
      case "soldier-commander":
        return "Chiffrement AES (Soldat → Commandant)";
      case "soldier-to-soldier":
        return "Chiffrement AES (Soldat → Soldat)";
      default:
        return "Chiffrement AES (Par défaut)";
    }
  };

  // Apply decorator pattern to message for display
  const applyMessageDecorators = (message: Message): Message => {
    const sender = users.find(u => u.id === message.senderId);
    
    // Create base message component
    let messageComponent: MessageComponent = new BaseMessage(message);
    
    // Apply timestamp decorator (horodatage)
    messageComponent = new TimestampDecorator(messageComponent);
    
    // Apply digital signature decorator
    messageComponent = new DigitalSignatureDecorator(messageComponent);
    
    // Process and get decorated message
    const decoratedMessage = messageComponent.process();
    
    // Add signature based on sender role
    let signatureText = "";
    if (sender?.role === "commander") {
      signatureText = `[Signé par ${sender.rank}]`;
    } else {
      signatureText = `[Signé par ${sender?.rank || "Soldat"}]`;
    }
    
    return {
      ...decoratedMessage,
      content: message.isDecrypted 
        ? `${decoratedMessage.content} ${signatureText}`
        : decoratedMessage.content
    };
  };

  // Decorator pattern for message display
  const applyMessageDecorators = (message: Message): any => {
    let messageComponent: MessageComponent = new BaseMessage(message);
    messageComponent = new TimestampDecorator(messageComponent);
    messageComponent = new DigitalSignatureDecorator(messageComponent);
    return messageComponent.process();
  };

  const handleDecrypt = (messageId: string) => {
    setDecryptingId(messageId);
    setTimeout(() => {
      onDecryptMessage(messageId);
      setDecryptingId(null);
    }, 800);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 secure-scrollbar">
      {sortedMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <Lock className="h-12 w-12 mb-2" />
          <p>Aucun message dans cette conversation</p>
        </div>
      ) : (
        messages.map((message) => {
          const sender = users.find((u) => u.id === message.senderId);
          const isCurrentUser = sender?.id === currentUser.id;
          const isDecrypting = decryptingId === message.id;
          
          // Apply decorator pattern for display
          const decoratedMessage = applyMessageDecorators(message);

          return (
            <div
              key={message.id}
              className={cn(
                "flex flex-col max-w-[80%] mb-4",
                isCurrentUser ? "ml-auto" : "mr-auto"
              )}
            >
              <div className="flex items-center mb-1">
                {!isCurrentUser && (
                  <span className="text-xs font-bold text-military-grey mr-2">
                    {message.expediteur.grade || ""} {message.expediteur.nom}
                  </span>
                )}
                <span className="text-xs text-military-grey/70">
                  {format(new Date(message.date_envoi), "HH:mm")}
                </span>
                {isCurrentUser && (
                  <span className="text-xs font-bold text-military-grey ml-2">
                    {message.expediteur.grade || ""} {message.expediteur.nom}
                  </span>
                )}
              </div>

              <div
                className={cn(
                  "rounded-lg p-3 shadow-sm",
                  isCurrentUser
                    ? "bg-military-olive text-white rounded-tr-none"
                    : "bg-military-light rounded-tl-none"
                )}
              >
                {message.isDecrypted ? (
                  <div className="decrypting">
                    {decoratedMessage.content}
                  </div>
                ) : isDecrypting ? (
                  <div className="encrypted-message text-sm opacity-80 animate-pulse">
                    Déchiffrement en cours...
                  </div>
                ) : (
                  <div className="encrypted-message text-sm opacity-80">
                    {message.encryptedContent}
                  </div>
                )}

                {/* Show decorator metadata when message is decrypted */}
                {message.isDecrypted && decoratedMessage.metadata && (
                  <div className="mt-2 pt-2 border-t border-white/20 text-xs opacity-70">
                    {decoratedMessage.metadata.timestampAdded && (
                      <div>Horodatage ajouté: {format(new Date(decoratedMessage.metadata.processedAt || Date.now()), "dd/MM/yyyy HH:mm:ss")}</div>
                    )}
                    {decoratedMessage.metadata.signatureAdded && decoratedMessage.metadata.signature && (
                      <div>Signature numérique: {decoratedMessage.metadata.signature}</div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center mt-1">
                <span className="text-xs text-military-grey/80 italic">
                  {getEncryptionTypeLabel(message.encryptionType, message.senderId, !!message.groupId)}
                </span>
                {!isDecrypting && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "ml-2 h-5 text-xs p-1 flex items-center",
                      isCurrentUser
                        ? "hover:bg-military-olive/20"
                        : "hover:bg-military-khaki/20"
                    )}
                    onClick={() => handleDecrypt(String(message.id))}
                    disabled={decryptingId === String(message.id)}
                  >
                    <Unlock className="h-3 w-3 mr-1" />
                    {decryptingId === String(message.id) ? "Déchiffrement..." : "Déchiffrer"}
                  </Button>
                )}
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
