
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Search } from "lucide-react";
import { User, Group } from "../types";
import { users } from "../data/mockData"; // TODO: REMOVE WHEN API IS READY

interface CreateGroupDialogProps {
  currentUser: User;
  onCreateGroup: (group: Group) => void;
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({
  currentUser,
  onCreateGroup
}) => {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [missionCode, setMissionCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // TODO: API INTEGRATION POINT - FETCH AVAILABLE USERS
  // GET /api/users?exclude=${currentUser.id}&role=soldier (or all users depending on requirements)
  // Should return: User[]
  const availableUsers = users.filter(user => user.id !== currentUser.id);

  // TODO: API INTEGRATION POINT - SEARCH USERS FOR GROUP CREATION
  // GET /api/users/search?q=${query}&exclude=${currentUser.id}&available_for_groups=true
  // Should return: User[]
  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setFilteredUsers([]);
      return;
    }

    try {
      // TODO: Replace mock implementation with real API call
      // const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&exclude=${currentUser.id}&available_for_groups=true`, {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${userToken}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const searchResults = await response.json();
      // setFilteredUsers(searchResults);

      // MOCK IMPLEMENTATION - REMOVE WHEN API IS READY
      const filtered = availableUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.rank?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } catch (error) {
      console.error('Error searching users for group:', error);
      setFilteredUsers([]);
    }
  };

  const toggleMemberSelection = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // TODO: API INTEGRATION POINT - CREATE GROUP
  // This function will be called by the parent component which should make the API call
  // POST /api/groups
  // Body: Group object
  // Should return: Group
  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedMembers.length === 0) {
      return;
    }

    const newGroup: Group = {
      id: `group-${Date.now()}`, // TODO: This should be generated by the backend
      name: groupName.trim(),
      description: groupDescription.trim() || undefined,
      members: [currentUser.id, ...selectedMembers], // Include commander as member
      commanderId: currentUser.id,
      missionCode: missionCode.trim() || undefined
    };

    onCreateGroup(newGroup);
    
    // Reset form
    setGroupName("");
    setGroupDescription("");
    setMissionCode("");
    setSelectedMembers([]);
    setSearchQuery("");
    setFilteredUsers([]);
    setOpen(false);
  };

  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const selectedUsers = availableUsers.filter(user => selectedMembers.includes(user.id));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2 text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
        >
          <Users className="h-4 w-4 mr-2" />
          Créer un groupe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un nouveau groupe</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Nom du groupe *</Label>
            <Input
              id="groupName"
              placeholder="Nom du groupe..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="groupDescription">Description</Label>
            <Input
              id="groupDescription"
              placeholder="Description du groupe..."
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="missionCode">Code de mission</Label>
            <Input
              id="missionCode"
              placeholder="Code de mission pour le chiffrement..."
              value={missionCode}
              onChange={(e) => setMissionCode(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Rechercher des membres</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {searchQuery.length >= 2 && (
            <Command className="border rounded-md max-h-48">
              <CommandList>
                {filteredUsers.length === 0 ? (
                  <CommandEmpty>Aucun utilisateur trouvé.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {filteredUsers.map((user) => (
                      <CommandItem
                        key={user.id}
                        onSelect={() => toggleMemberSelection(user.id)}
                        className="flex items-center space-x-3 p-3 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedMembers.includes(user.id)}
                          onChange={() => toggleMemberSelection(user.id)}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback>
                            {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.rank} {user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.role}</p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          )}
          
          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <Label>Membres sélectionnés ({selectedUsers.length})</Label>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-2 bg-muted px-2 py-1 rounded text-sm"
                  >
                    <span>{user.rank} {user.name}</span>
                    <button
                      onClick={() => toggleMemberSelection(user.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Button
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedMembers.length === 0}
            className="w-full"
          >
            Créer le groupe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
