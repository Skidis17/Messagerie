
// Observer Pattern - For group notifications
export interface Observer {
  update(message: string, data?: any): void;
  getId(): string;
}

export interface Subject {
  addObserver(observer: Observer): void;
  removeObserver(observer: Observer): void;
  notifyObservers(message: string, data?: any): void;
}

// Concrete Observer for users
export class UserNotificationObserver implements Observer {
  private userId: string;
  private userName: string;

  constructor(userId: string, userName: string) {
    this.userId = userId;
    this.userName = userName;
  }

  update(message: string, data?: any): void {
    console.log(`[${this.userName}] Notification: ${message}`, data);
    // In a real app, this would show a toast notification
    // toast({ title: "Nouveau message", description: message });
  }

  getId(): string {
    return this.userId;
  }
}

// Concrete Subject for group messaging
export class GroupMessagingSubject implements Subject {
  private observers: Observer[] = [];
  private groupId: string;

  constructor(groupId: string) {
    this.groupId = groupId;
  }

  addObserver(observer: Observer): void {
    if (!this.observers.find(obs => obs.getId() === observer.getId())) {
      this.observers.push(observer);
      console.log(`Observer ${observer.getId()} added to group ${this.groupId}`);
    }
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter(obs => obs.getId() !== observer.getId());
    console.log(`Observer ${observer.getId()} removed from group ${this.groupId}`);
  }

  notifyObservers(message: string, data?: any): void {
    console.log(`Notifying ${this.observers.length} observers in group ${this.groupId}`);
    this.observers.forEach(observer => observer.update(message, data));
  }

  // Method to send group message and notify all members
  sendGroupMessage(senderName: string, messageContent: string): void {
    const notificationMessage = `Nouveau message de ${senderName} dans le groupe`;
    this.notifyObservers(notificationMessage, { 
      content: messageContent,
      sender: senderName,
      groupId: this.groupId 
    });
  }
}
