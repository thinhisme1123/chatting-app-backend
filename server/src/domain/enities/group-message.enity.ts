// src/domain/entities/group-message.entity.ts
export interface GroupMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
}
