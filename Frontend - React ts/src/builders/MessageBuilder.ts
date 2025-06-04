
import { Message, EncryptionType } from "../types";

// Builder Pattern - For creating complex messages
export class MessageBuilder {
  private message: Partial<Message> = {};

  static create(): MessageBuilder {
    return new MessageBuilder();
  }

  setSender(senderId: string): MessageBuilder {
    this.message.senderId = senderId;
    return this;
  }

  setReceiver(receiverId: string | null): MessageBuilder {
    this.message.receiverId = receiverId;
    return this;
  }

  setGroup(groupId: string): MessageBuilder {
    this.message.groupId = groupId;
    this.message.receiverId = null; // Group messages don't have individual receivers
    return this;
  }

  setContent(content: string): MessageBuilder {
    this.message.content = content;
    return this;
  }

  setEncryptionType(encryptionType: EncryptionType): MessageBuilder {
    this.message.encryptionType = encryptionType;
    return this;
  }

  setTimestamp(timestamp?: number): MessageBuilder {
    this.message.timestamp = timestamp || Date.now();
    return this;
  }

  build(): Message {
    // Generate ID if not provided
    if (!this.message.id) {
      this.message.id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Set timestamp if not provided
    if (!this.message.timestamp) {
      this.message.timestamp = Date.now();
    }

    // Set default encryption type if not provided
    if (!this.message.encryptionType) {
      this.message.encryptionType = "soldier-commander";
    }

    // Initialize as encrypted (will be processed by encryption strategy)
    this.message.isDecrypted = false;
    this.message.encryptedContent = ""; // Will be set by encryption strategy

    // Validate required fields after setting defaults
    if (!this.message.senderId || !this.message.content) {
      throw new Error("Message builder: Missing required fields (senderId, content)");
    }

    return this.message as Message;
  }

  // Reset builder for reuse
  reset(): MessageBuilder {
    this.message = {};
    return this;
  }
}
