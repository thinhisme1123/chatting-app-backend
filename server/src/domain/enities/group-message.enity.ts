// src/domain/entities/group-message.entity.ts
export interface GroupMessage {
  id: string;
  roomId: string;
  fromUserId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
}
