import React from "react";
import { User } from "../types";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
    

interface UserMenuDropdownProps {
  currentUser: User;
  onLogout: () => void;
}

const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({ currentUser, onLogout }) => {
  
  console.log("Current user data:", currentUser);

  const initials = (currentUser.nom || "")
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-military-khaki">
            {currentUser.avatarUrl ? (
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.nom} />
            ) : (
              <AvatarFallback className="bg-military-olive text-military-light">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-xl leading-none">{currentUser.nom}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.code || ""}
            </p>
            <div className="flex items-center mt-1">
              {currentUser.role === "commandant" ? (
                <Shield className="h-3 w-3 mr-1 text-military-olive" />
              ) : (
                <UserIcon className="h-3 w-3 mr-1 text-military-khaki" />
              )}
              <span className="text-xs">
                {currentUser.role === "commandant" ? "Commandant" : "Soldat"}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-red-500 cursor-pointer"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenuDropdown;
