export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  imageUrl?: string | '';
  timestamp: Date;
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
    imageUrl?: string;
  } | null;
  edited: boolean
}
