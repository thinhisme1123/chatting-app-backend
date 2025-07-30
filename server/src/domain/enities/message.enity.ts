export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  } | null;
}
