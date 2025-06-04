
import { Message } from "../types";

// Decorator Pattern - For adding security layers to messages
export interface MessageComponent {
  process(): Message;
}

// Base concrete component
export class BaseMessage implements MessageComponent {
  constructor(private message: Message) {}

  process(): Message {
    return this.message;
  }
}

// Base decorator
export abstract class MessageDecorator implements MessageComponent {
  protected component: MessageComponent;

  constructor(component: MessageComponent) {
    this.component = component;
  }

  process(): Message {
    return this.component.process();
  }
}

// Concrete decorator for adding timestamp (horodatage)
export class TimestampDecorator extends MessageDecorator {
  process(): Message {
    const message = super.process();
    return {
      ...message,
      content: `[${new Date().toISOString()}] ${message.content}`,
      metadata: {
        ...message.metadata,
        timestampAdded: true,
        processedAt: Date.now()
      }
    };
  }
}

// Concrete decorator for adding digital signature
export class DigitalSignatureDecorator extends MessageDecorator {
  private generateSignature(content: string): string {
    // Simple signature simulation - in real app, use proper cryptographic signature
    return btoa(content).slice(-8);
  }

  process(): Message {
    const message = super.process();
    const signature = this.generateSignature(message.content);
    
    return {
      ...message,
      content: `${message.content} [SIG:${signature}]`,
      metadata: {
        ...message.metadata,
        signature,
        signatureAdded: true
      }
    };
  }
}

// New decorator for adding military rank signature
export class MilitarySignatureDecorator extends MessageDecorator {
  constructor(component: MessageComponent, private senderRank: string, private senderRole: string) {
    super(component);
  }

  process(): Message {
    const message = super.process();
    let signatureText = "";
    
    if (this.senderRole === "commander") {
      signatureText = `[Signé par le ${this.senderRank}]`;
    } else {
      signatureText = `[Signé par ${this.senderRank}]`;
    }
    
    return {
      ...message,
      content: `${message.content} ${signatureText}`,
      metadata: {
        ...message.metadata,
        militarySignature: signatureText,
        militarySignatureAdded: true
      }
    };
  }
}
