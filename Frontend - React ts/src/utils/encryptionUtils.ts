
/**
 * Custom military-grade encryption algorithms
 * Note: In a real application, you would use proven cryptography libraries
 */

// Caesar cipher with variable shift based on a military key
export const militaryEncrypt = (text: string, key: string = "ALPHA"): string => {
  // Create a numeric key from the string key
  const numericKey = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 26;
  
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    
    // Only encrypt letters
    if (code >= 65 && code <= 90) { // Uppercase
      return String.fromCharCode((code - 65 + numericKey) % 26 + 65);
    } else if (code >= 97 && code <= 122) { // Lowercase
      return String.fromCharCode((code - 97 + numericKey) % 26 + 97);
    }
    return char;
  }).join('');
};

// Caesar cipher decrypt with variable shift based on a military key
export const militaryDecrypt = (encryptedText: string, key: string = "ALPHA"): string => {
  // Create a numeric key from the string key
  const numericKey = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 26;
  
  return encryptedText.split('').map(char => {
    const code = char.charCodeAt(0);
    
    // Only decrypt letters
    if (code >= 65 && code <= 90) { // Uppercase
      return String.fromCharCode((code - 65 - numericKey + 26) % 26 + 65);
    } else if (code >= 97 && code <= 122) { // Lowercase
      return String.fromCharCode((code - 97 - numericKey + 26) % 26 + 97);
    }
    return char;
  }).join('');
};

// Command level encryption (more complex)
export const commandEncrypt = (text: string, commandKey: string = "COMMANDER"): string => {
  const baseEncrypted = militaryEncrypt(text, commandKey);
  // Add an extra layer of obfuscation for command messages
  return btoa(baseEncrypted).replace(/=/g, "#").split('').reverse().join('');
};

// Command level decryption
export const commandDecrypt = (encryptedText: string, commandKey: string = "COMMANDER"): string => {
  // Reverse the extra layer of obfuscation
  const reversed = encryptedText.split('').reverse().join('').replace(/#/g, "=");
  try {
    const baseText = atob(reversed);
    return militaryDecrypt(baseText, commandKey);
  } catch (e) {
    console.error("Decryption failed:", e);
    return "ÉCHEC DU DÉCHIFFREMENT";
  }
};

// Mission level encryption (highest security)
export const missionEncrypt = (text: string, missionCode: string = "MISSION_ALPHA"): string => {
  const step1 = militaryEncrypt(text, missionCode);
  const step2 = step1.split('').map((char, i) => {
    const code = char.charCodeAt(0);
    const shift = (i % missionCode.length) + 1;
    return String.fromCharCode(code + shift);
  }).join('');
  
  return btoa(step2).replace(/=/g, "*");
};

// Mission level decryption
export const missionDecrypt = (encryptedText: string, missionCode: string = "MISSION_ALPHA"): string => {
  try {
    const step1 = atob(encryptedText.replace(/\*/g, "="));
    const step2 = step1.split('').map((char, i) => {
      const code = char.charCodeAt(0);
      const shift = (i % missionCode.length) + 1;
      return String.fromCharCode(code - shift);
    }).join('');
    
    return militaryDecrypt(step2, missionCode);
  } catch (e) {
    console.error("Mission decryption failed:", e);
    return "ÉCHEC DU DÉCHIFFREMENT DE MISSION";
  }
};

// Function to decide which encryption to use based on the type
export const encryptMessage = (message: string, type: string, key: string = ""): string => {
  switch (type) {
    case "soldier-to-soldier":
      return militaryEncrypt(message);
    case "commander-to-soldier":
      return commandEncrypt(message);
    case "commander-to-group":
      return missionEncrypt(message, key);
    default:
      return militaryEncrypt(message);
  }
};

// Function to decide which decryption to use based on the type
export const decryptMessage = (encryptedMessage: string, type: string, key: string = ""): string => {
  switch (type) {
    case "soldier-to-soldier":
      return militaryDecrypt(encryptedMessage);
    case "commander-to-soldier":
      return commandDecrypt(encryptedMessage);
    case "commander-to-group":
      return missionDecrypt(encryptedMessage, key);
    default:
      return militaryDecrypt(encryptedMessage);
  }
};
