
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MobileHeaderProps {
  onToggleSidebar: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onToggleSidebar }) => {
  return (
    <div className="md:hidden fixed top-0 left-0 z-50 p-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-military-olive text-military-light"
        onClick={onToggleSidebar}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MobileHeader;
