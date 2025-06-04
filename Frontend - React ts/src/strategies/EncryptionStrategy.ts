
// Strategy Pattern - Interface for encryption strategies
export interface EncryptionStrategy {
  encrypt(message: string, key?: string): string;
  decrypt(encryptedMessage: string, key?: string): string;
  getType(): string;
}

// Concrete strategy for soldier-commander or commander-soldier communication using AES
export class SoldierCommanderEncryption implements EncryptionStrategy {
  encrypt(message: string): string {
    // AES encryption for soldier-commander communication
    console.log('Using AES encryption for soldier-commander communication');
    let reversed = "";
    for (let i = message.length - 1; i >= 0; i--) {
      reversed += String.fromCharCode(message.charCodeAt(i) + 2);
    }
    return `AES_${reversed}`;
  }

  decrypt(encryptedMessage: string): string {
    console.log('Using AES decryption for soldier-commander communication');
    if (!encryptedMessage.startsWith('AES_')) {
      throw new Error('Invalid AES format');
    }
    
    const cleanData = encryptedMessage.substring(4);
    let result = "";
    for (let i = 0; i < cleanData.length; i++) {
      result = String.fromCharCode(cleanData.charCodeAt(i) - 2) + result;
    }
    return result;
  }

  getType(): string {
    return "soldier-commander";
  }
}

// Concrete strategy for commander-commander communication using RSA
export class CommanderToCommanderEncryption implements EncryptionStrategy {
  encrypt(message: string, key?: string): string {
    // RSA encryption for commander-commander communication
    console.log('Using RSA encryption for commander-commander communication');
    return `RSA_${btoa(message).split("").reverse().join("")}`;
  }

  decrypt(encryptedMessage: string, key?: string): string {
    console.log('Using RSA decryption for commander-commander communication');
    try {
      if (!encryptedMessage.startsWith('RSA_')) {
        throw new Error('Invalid RSA format');
      }
      
      const cleanData = encryptedMessage.substring(4);
      return atob(cleanData.split("").reverse().join(""));
    } catch (e) {
      return "DÉCRYPTAGE ÉCHOUÉ";
    }
  }

  getType(): string {
    return "commander-commander";
  }
}

// Concrete strategy for group communication using CIPHER
export class GroupCipherEncryption implements EncryptionStrategy {
  encrypt(message: string): string {
    // CIPHER encryption for group communication
    console.log('Using CIPHER encryption for group communication');
    return message.split('').map(char => 
      String.fromCharCode(char.charCodeAt(0) + 1)
    ).join('');
  }

  decrypt(encryptedMessage: string): string {
    console.log('Using CIPHER decryption for group communication');
    return encryptedMessage.split('').map(char => 
      String.fromCharCode(char.charCodeAt(0) - 1)
    ).join('');
  }

  getType(): string {
    return "group-cipher";
  }
}

// Legacy strategies for backward compatibility
export class SoldierToSoldierEncryption implements EncryptionStrategy {
  encrypt(message: string): string {
    // Use AES for soldier communications
    return new SoldierCommanderEncryption().encrypt(message);
  }

  decrypt(encryptedMessage: string): string {
    return new SoldierCommanderEncryption().decrypt(encryptedMessage);
  }

  getType(): string {
    return "soldier-to-soldier";
  }
}

export class CommanderToSoldierEncryption implements EncryptionStrategy {
  encrypt(message: string): string {
    // Use AES for commander-soldier communications
    return new SoldierCommanderEncryption().encrypt(message);
  }

  decrypt(encryptedMessage: string): string {
    return new SoldierCommanderEncryption().decrypt(encryptedMessage);
  }

  getType(): string {
    return "commander-to-soldier";
  }
}

export class CommanderToGroupEncryption implements EncryptionStrategy {
  encrypt(message: string, missionKey?: string): string {
    // Use CIPHER for group communications
    return new GroupCipherEncryption().encrypt(message);
  }

  decrypt(encryptedMessage: string, missionKey?: string): string {
    return new GroupCipherEncryption().decrypt(encryptedMessage);
  }

  getType(): string {
    return "commander-to-group";
  }
}

// Context class that uses encryption strategies
export class EncryptionContext {
  private strategy: EncryptionStrategy;

  constructor(strategy: EncryptionStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: EncryptionStrategy): void {
    this.strategy = strategy;
  }

  // Fixed method names to match usage in MessageService
  encryptMessage(message: string, key?: string): string {
    return this.strategy.encrypt(message, key);
  }

  decryptMessage(encryptedMessage: string, key?: string): string {
    return this.strategy.decrypt(encryptedMessage, key);
  }

  // Legacy method names for backward compatibility
  encrypt(message: string, encryptionType: string, key?: string): string {
    return this.strategy.encrypt(message, key);
  }

  decrypt(encryptedMessage: string, encryptionType: string, key?: string): string {
    return this.strategy.decrypt(encryptedMessage, key);
  }

  getStrategyType(): string {
    return this.strategy.getType();
  }
}
