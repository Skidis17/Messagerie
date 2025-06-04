import { Message, EncryptionType, User, Group } from "../types";
import { MessageBuilder } from "../builders/MessageBuilder";
import { 
  BaseMessage, 
  TimestampDecorator, 
  DigitalSignatureDecorator,
  MessageComponent
} from "../decorators/MessageDecorator";
import { 
  EncryptionContext, 
  SoldierCommanderEncryption,
  CommanderToCommanderEncryption,
  GroupCipherEncryption
} from "../strategies/EncryptionStrategy";
import { EncryptionLibraryAdapter, EncryptionAdapterFactory } from "../adapters/EncryptionAdapter";
import { GroupMessagingSubject, UserNotificationObserver } from "../observers/NotificationObserver";

// Service class that orchestrates all design patterns
export class MessageService {
  private encryptionContext: EncryptionContext;
  private encryptionAdapter: EncryptionLibraryAdapter;
  private groupSubjects: Map<string, GroupMessagingSubject> = new Map();
  private messages: Message[] = []; // Store messages locally
  private notificationCallbacks: ((notification: any) => void)[] = [];

  constructor() {
    // Initialize with a default strategy
    this.encryptionContext = new EncryptionContext(new SoldierCommanderEncryption());
    this.encryptionAdapter = EncryptionAdapterFactory.createBouncyCastleAdapter() as EncryptionLibraryAdapter;
  }

  // Set the appropriate encryption strategy based on sender and receiver roles
  private setEncryptionStrategyByRoles(senderRole: string, receiverRole?: string, isGroup?: boolean): EncryptionType {
    if (isGroup) {
      // Group messages use CIPHER encryption
      this.encryptionContext.setStrategy(new GroupCipherEncryption());
      return "group-cipher";
    } else if (senderRole === "commander" && receiverRole === "commander") {
      // Commander-Commander uses RSA encryption
      this.encryptionContext.setStrategy(new CommanderToCommanderEncryption());
      return "commander-commander";
    } else if (senderRole === "soldier" && receiverRole === "commander") {
      // Soldier to Commander uses AES encryption
      this.encryptionContext.setStrategy(new SoldierCommanderEncryption());
      return "soldier-commander";
    } else if (senderRole === "commander" && receiverRole === "soldier") {
      // Commander to Soldier uses AES encryption  
      this.encryptionContext.setStrategy(new SoldierCommanderEncryption());
      return "commander-to-soldier";
    } else {
      // Soldier to Soldier uses AES encryption
      this.encryptionContext.setStrategy(new SoldierCommanderEncryption());
      return "soldier-to-soldier";
    }
  }

  // Add method to subscribe to notifications
  subscribeToNotifications(callback: (notification: any) => void): void {
    this.notificationCallbacks.push(callback);
  }

  // Add method to unsubscribe from notifications
  unsubscribeFromNotifications(callback: (notification: any) => void): void {
    this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
  }

  // Trigger notification for UI
  private triggerNotification(notification: any): void {
    this.notificationCallbacks.forEach(callback => callback(notification));
  }

  // Add method to get message by ID
  getMessageById(messageId: string): Message | undefined {
    return this.messages.find(msg => msg.id === messageId);
  }

  // Add method to store messages
  private storeMessage(message: Message): void {
    this.messages.push(message);
  }

  // Create a message using Builder + Decorator patterns with proper encryption logic
  createMessage(
    senderId: string,
    receiverId: string | null,
    content: string,
    encryptionType: EncryptionType,
    groupId?: string,
    senderRole?: string,
    receiverRole?: string
  ): Message {
    // Use Builder Pattern to create the message
    let builder = MessageBuilder.create()
      .setSender(senderId)
      .setContent(content)
      .setTimestamp();

    if (groupId) {
      builder = builder.setGroup(groupId);
    } else {
      builder = builder.setReceiver(receiverId);
    }

    // Determine the correct encryption type based on roles
    const actualEncryptionType = this.setEncryptionStrategyByRoles(senderRole!, receiverRole, !!groupId);
    
    // Set the determined encryption type
    builder = builder.setEncryptionType(actualEncryptionType);

    const baseMessage = builder.build();

    // Use Decorator Pattern to add security layers
    let messageComponent: MessageComponent = new BaseMessage(baseMessage);
    
    // Add timestamp decorator
    messageComponent = new TimestampDecorator(messageComponent);
    
    // Add digital signature decorator
    messageComponent = new DigitalSignatureDecorator(messageComponent);

    const decoratedMessage = messageComponent.process();

    // Encrypt the content using the selected strategy
    const encryptedContent = this.encryptionContext.encryptMessage(content);
    
    const finalMessage = {
      ...decoratedMessage,
      encryptedContent,
      encryptionType: actualEncryptionType
    };

    // Store the message
    this.storeMessage(finalMessage);
    
    return finalMessage;
  }

  // Decrypt message using Strategy Pattern with proper strategy selection
  decryptMessage(message: Message, decryptionKey?: string): string {
    // Set the correct encryption strategy based on the message's encryption type
    if (message.encryptionType === "group-cipher") {
      this.encryptionContext.setStrategy(new GroupCipherEncryption());
    } else if (message.encryptionType === "commander-commander") {
      this.encryptionContext.setStrategy(new CommanderToCommanderEncryption());
    } else {
      // For soldier-commander, commander-soldier, soldier-to-soldier - all use AES
      this.encryptionContext.setStrategy(new SoldierCommanderEncryption());
    }
    
    return this.encryptionContext.decryptMessage(message.encryptedContent, decryptionKey);
  }

  // Setup group notifications using Observer Pattern
  setupGroupNotifications(group: Group, users: User[]): void {
    const subject = new GroupMessagingSubject(group.id);
    
    group.members.forEach(memberId => {
      const user = users.find(u => u.id === memberId);
      if (user) {
        const observer = new UserNotificationObserver(user.id, user.name);
        subject.addObserver(observer);
      }
    });
    
    this.groupSubjects.set(group.id, subject);
  }

  // Send group message using Observer Pattern
  sendGroupMessage(message: Message, senderName: string): void {
    if (message.groupId) {
      const subject = this.groupSubjects.get(message.groupId);
      if (subject) {
        subject.sendGroupMessage(senderName, message.content);
        
        // Trigger UI notification
        this.triggerNotification({
          type: 'group_message',
          title: 'Nouveau message de groupe',
          message: `${senderName}: ${message.content}`,
          timestamp: new Date(),
          groupId: message.groupId
        });
      }
    }
  }

  // Send direct message notification
  sendDirectMessage(message: Message, senderName: string, receiverName: string): void {
    // Trigger UI notification for direct messages
    this.triggerNotification({
      type: 'direct_message',
      title: 'Nouveau message',
      message: `${senderName}: ${message.content}`,
      timestamp: new Date(),
      senderId: message.senderId,
      receiverId: message.receiverId
    });
  }

  // Send message to backend
  sendMessageToBackend(message: Message): void {
    console.log('Sending message to Spring Boot backend:', {
      id: message.id,
      senderId: message.senderId,
      receiverId: message.receiverId,
      groupId: message.groupId,
      encryptedContent: message.encryptedContent,
      encryptionType: message.encryptionType,
      timestamp: message.timestamp,
      metadata: message.metadata
    });
  }
}

// Export singleton instance
export const messageService = new MessageService();
