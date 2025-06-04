
import React from "react";
import ChatScreen from "../components/ChatScreen";
import { User } from "../types";

interface IndexProps {
  currentUser: User;
  onLogout: () => void;
}

const Index: React.FC<IndexProps> = ({ currentUser, onLogout }) => {
  return (
    <div className="min-h-screen bg-military-light/30 font-pluto">
      <ChatScreen currentUser={currentUser} onLogout={onLogout} />
    </div>
  );
};

export default Index;
