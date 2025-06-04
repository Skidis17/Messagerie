
import { User } from "../types";

export const users: User[] = [
  {
    id: "user1",
    name: "Général Youssef",
    role: "commander",
    rank: "Général",
    avatarUrl: "/avatars/general.jpg"
  },
  {
    id: "user2",
    name: "Lt. Bourid",
    role: "commander",
    rank: "Lieutenant",
    avatarUrl: "/avatars/lieutenant.jpg"
  },
  {
    id: "user3",
    name: "Sgt. Mohaa",
    role: "soldier",
    rank: "Sergent",
    avatarUrl: "/avatars/sergeant.jpg"
  },
  {
    id: "user4",
    name: "Cpl. Ali",
    role: "soldier",
    rank: "Caporal",
    avatarUrl: "/avatars/corporal.jpg"
  },
  {
    id: "user5",
    name: "Pvt. Nassim",
    role: "soldier",
    rank: "Soldat",
    avatarUrl: "/avatars/private.jpg"
  }
];

// TODO: API INTEGRATION POINT - FETCH USERS
// GET /api/users
// Should return: User[]

// TODO: API INTEGRATION POINT - SEARCH USERS
// GET /api/users/search?q=${query}&exclude=${currentUserId}
// Should return: User[]

// Utilisateur connecté pour la démo
export const currentUser: User = users[0]; // Général Youssef (commandant)
