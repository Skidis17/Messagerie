
// Adapter Pattern - For integrating external encryption libraries
export interface ExternalEncryptionLibrary {
  encryptData(data: string, options?: any): string;
  decryptData(encryptedData: string, options?: any): string;
}

// Mock external library (simulating BouncyCastle or similar)
export class MockBouncyCastleLibrary implements ExternalEncryptionLibrary {
  encryptData(data: string, options?: any): string {
    // Simulate complex encryption
    const encrypted = btoa(data).split('').map(char => 
      String.fromCharCode(char.charCodeAt(0) + 3)
    ).join('');
    return `BC_${encrypted}`;
  }

  decryptData(encryptedData: string, options?: any): string {
    if (!encryptedData.startsWith('BC_')) {
      throw new Error('Invalid BouncyCastle format');
    }
    
    const cleanData = encryptedData.substring(3);
    const decrypted = cleanData.split('').map(char => 
      String.fromCharCode(char.charCodeAt(0) - 3)
    ).join('');
    
    return atob(decrypted);
  }
}

// Our application's encryption interface
export interface AppEncryptionInterface {
  encrypt(message: string, key?: string): string;
  decrypt(encryptedMessage: string, key?: string): string;
}

// Adapter to make external library compatible with our interface
export class EncryptionLibraryAdapter implements AppEncryptionInterface {
  private externalLibrary: ExternalEncryptionLibrary;

  constructor(externalLibrary: ExternalEncryptionLibrary) {
    this.externalLibrary = externalLibrary;
  }

  encrypt(message: string, key?: string): string {
    try {
      return this.externalLibrary.encryptData(message, { key });
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt message');
    }
  }

  decrypt(encryptedMessage: string, key?: string): string {
    try {
      return this.externalLibrary.decryptData(encryptedMessage, { key });
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt message');
    }
  }
}

// Factory to create different encryption adapters
export class EncryptionAdapterFactory {
  static createBouncyCastleAdapter(): AppEncryptionInterface {
    const library = new MockBouncyCastleLibrary();
    return new EncryptionLibraryAdapter(library);
  }

  // Add more adapters as needed
  static createCustomAdapter(library: ExternalEncryptionLibrary): AppEncryptionInterface {
    return new EncryptionLibraryAdapter(library);
  }
}
