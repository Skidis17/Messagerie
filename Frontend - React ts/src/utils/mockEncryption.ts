
import { EncryptionType } from "../types";

// TODO: REPLACE WITH REAL ENCRYPTION - This is for demo purposes only
// In production, use proper encryption algorithms like AES-256-GCM
// API INTEGRATION POINT - ENCRYPTION SERVICE
// POST /api/encryption/encrypt
// Body: { content: string, encryptionType: EncryptionType, key?: string }
// Should return: { encryptedContent: string }

export function mockEncrypt(text: string, type: EncryptionType): string {
  let result = "";
  
  switch(type) {
    case "soldier-to-soldier":
      // Simple substitution
      for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) + 1);
      }
      break;
    case "commander-to-soldier":
      // Reverse + substitution
      for (let i = text.length - 1; i >= 0; i--) {
        result += String.fromCharCode(text.charCodeAt(i) + 2);
      }
      break;
    case "commander-to-group":
      // Mock d'un chiffrement plus complexe
      result = btoa(text).split("").reverse().join("");
      break;
    default:
      result = btoa(text);
  }
  
  return result;
}

// TODO: REPLACE WITH REAL DECRYPTION - This is for demo purposes only
// API INTEGRATION POINT - DECRYPTION SERVICE
// POST /api/encryption/decrypt
// Body: { encryptedContent: string, encryptionType: EncryptionType, key?: string }
// Should return: { decryptedContent: string }

export function mockDecrypt(encryptedText: string, type: EncryptionType): string {
  let result = "";
  
  switch(type) {
    case "soldier-to-soldier":
      for (let i = 0; i < encryptedText.length; i++) {
        result += String.fromCharCode(encryptedText.charCodeAt(i) - 1);
      }
      break;
    case "commander-to-soldier":
      let reversed = "";
      for (let i = 0; i < encryptedText.length; i++) {
        reversed = String.fromCharCode(encryptedText.charCodeAt(i) - 2) + reversed;
      }
      result = reversed;
      break;
    case "commander-to-group":
      result = atob(encryptedText.split("").reverse().join(""));
      break;
    default:
      result = atob(encryptedText);
  }
  
  return result;
}
