import React, { useState } from "react";
import { User, Message, Conversation } from "../types";
import { users } from "../data/mockData";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Filter, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface MessageHistoryProps {
  currentUser: User;
  currentConversation: Conversation;
  messages: Message[];
  onClose: () => void;
}

const MessageHistory: React.FC<MessageHistoryProps> = ({
  currentUser,
  currentConversation,
  messages,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState<Message[]>(messages);
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Sort messages by timestamp (newest first for history view)
  const sortedMessages = [...filteredMessages].sort((a, b) => b.timestamp - a.timestamp);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term) {
      setFilteredMessages(messages);
      return;
    }
    
    const filtered = messages.filter(msg => 
      msg.isDecrypted && 
      msg.content.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredMessages(filtered);
  };

  // Handle date filter
  const applyDateFilter = () => {
    if (!startDate && !endDate) {
      setFilteredMessages(messages);
      return;
    }
    
    const filtered = messages.filter(msg => {
      const msgDate = new Date(msg.timestamp);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date(Date.now() + 86400000); // Add one day to include today
      
      return msgDate >= start && msgDate <= end;
    });
    
    setFilteredMessages(filtered);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setFilteredMessages(messages);
    setShowFilters(false);
  };

  // Export history as CSV
  const exportHistory = () => {
    const csvContent = [
      ["Date", "Sender", "Message", "Type"],
      ...sortedMessages.map(msg => [
        format(new Date(msg.timestamp), "yyyy-MM-dd HH:mm:ss"),
        users.find(u => u.id === msg.senderId)?.name || "Unknown",
        msg.isDecrypted ? msg.content : "[ENCRYPTED]",
        msg.encryptionType
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `message-history-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="absolute inset-0 bg-military-light/95 flex flex-col z-50">
      <div className="p-4 bg-military-olive text-white flex items-center justify-between">
        <h2 className="font-bold">Historique des Messages</h2>
        <Button variant="ghost" size="sm" className="text-white" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="p-4 border-b">
        <div className="flex gap-2 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-military-grey" />
            <Input
              placeholder="Rechercher dans l'historique..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "border-military-olive text-military-olive",
              showFilters && "bg-military-olive/10"
            )}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filtres
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={exportHistory}
            className="border-military-olive text-military-olive"
          >
            <Download className="h-4 w-4 mr-1" />
            Exporter
          </Button>
        </div>
        
        {showFilters && (
          <div className="bg-military-light/50 p-3 rounded-md mt-2 border border-military-olive/20">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <p className="text-xs mb-1 text-military-grey">Date de début</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-military-grey" />
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-military-grey/30 rounded p-1 text-sm"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs mb-1 text-military-grey">Date de fin</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-military-grey" />
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-military-grey/30 rounded p-1 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="default" onClick={applyDateFilter} className="bg-military-olive">
                  Appliquer
                </Button>
                <Button size="sm" variant="outline" onClick={resetFilters}>
                  Réinitialiser
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 secure-scrollbar">
        {sortedMessages.length === 0 ? (
          <div className="text-center p-8 text-military-grey">
            <p>Aucun message correspondant aux critères</p>
          </div>
        ) : (
          sortedMessages.map((message) => {
            const sender = users.find((u) => u.id === message.senderId);
            
            return (
              <div key={message.id} className="border-b border-military-khaki/20 pb-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm">
                    {sender?.rank} {sender?.name}
                  </span>
                  <span className="text-xs text-military-grey">
                    {format(new Date(message.timestamp), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
                
                <div className="bg-military-light/50 p-3 rounded">
                  {message.isDecrypted ? (
                    <p>{message.content}</p>
                  ) : (
                    <p className="encrypted-message opacity-70">
                      [Message chiffré] {message.encryptedContent.substring(0, 30)}...
                    </p>
                  )}
                </div>
                
                <div className="flex mt-1 text-xs text-military-grey">
                  <span>Type: {message.encryptionType}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MessageHistory;
