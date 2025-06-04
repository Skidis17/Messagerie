import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search } from "lucide-react";
import { User } from "../types";
import { api } from "../services/api";

interface NewConversationDialogProps {
  currentUser: User;
  onCreateConversation: (selectedUser: User) => void;
}

const NewConversationDialog: React.FC<NewConversationDialogProps> = ({
  currentUser,
  onCreateConversation
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setFilteredUsers([]);
      return;
    }

    try {
      // Get all users based on current user's role
      const users = currentUser.role === "commandant" 
        ? await api.getAllSoldiers()
        : await api.getAllCommandants();

      // Filter users based on search query
      const filtered = users.filter(user => 
        user.nom.toLowerCase().includes(query.toLowerCase()) ||
        (user.code && user.code.toLowerCase().includes(query.toLowerCase()))
      );
      
      setFilteredUsers(filtered);
    } catch (error) {
      console.error('Error searching users:', error);
      setFilteredUsers([]);
    }
  };

  const handleUserSelect = (selectedUser: User) => {
    onCreateConversation(selectedUser);
    setOpen(false);
    setSearchQuery("");
    setFilteredUsers([]);
  };

  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2 text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle conversation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle conversation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {searchQuery.length >= 2 && (
            <Command className="border rounded-md">
              <CommandList>
                {filteredUsers.length === 0 ? (
                  <CommandEmpty>Aucun utilisateur trouvé.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {filteredUsers.map((user) => (
                      <CommandItem
                        key={user.id}
                        onSelect={() => handleUserSelect(user)}
                        className="flex items-center space-x-3 p-3 cursor-pointer"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl} alt={user.nom} />
                          <AvatarFallback>
                            {user.nom.split(" ").map(n => n[0]).join("").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.grade ? `${user.grade} ` : ''}{user.nom}</p>
                          <p className="text-xs text-muted-foreground">{user.code}</p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;
