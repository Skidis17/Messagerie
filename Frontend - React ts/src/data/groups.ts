
import { Group } from "../types";

export const groups: Group[] = [
  {
    id: "group1",
    name: "Opération TINDOUF",
    description: "Groupe tactique pour l'opération TINDOUF",
    members: ["user1", "user2", "user3", "user4"],
    commanderId: "user1",
    missionCode: "OPS-A75"
  },
  {
    id: "group2",
    name: "Équipe Bengurir",
    description: "Équipe de reconnaissance Delta",
    members: ["user2", "user3", "user5"],
    commanderId: "user2",
    missionCode: "RECON-D22"
  }
];

// TODO: API INTEGRATION POINT - FETCH GROUPS
// GET /api/groups?userId=${currentUserId}
// Should return: Group[]

// TODO: API INTEGRATION POINT - CREATE GROUP
// POST /api/groups
// Body: Group object
// Should return: Group
