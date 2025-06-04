
// Main entry point for all mock data - Re-exports everything for backward compatibility
// TODO: Remove this file when transitioning to real API calls

export { users, currentUser } from "./users";
export { groups } from "./groups";
export { messages, createNewMessage } from "./messages";
export { conversations } from "./conversations";
export { mockEncrypt, mockDecrypt } from "../utils/mockEncryption";

// TODO: API INTEGRATION CHECKLIST
// 1. Replace users data with GET /api/users
// 2. Replace groups data with GET /api/groups?userId=${currentUserId}
// 3. Replace messages data with GET /api/messages?userId=${currentUserId}
// 4. Replace conversations data with GET /api/conversations?userId=${currentUserId}
// 5. Replace mock encryption with real encryption service
// 6. Implement real-time messaging with WebSocket/SSE
// 7. Add authentication token management
// 8. Add error handling and retry logic
// 9. Add data caching and synchronization
// 10. Remove all mock data files after API integration is complete
