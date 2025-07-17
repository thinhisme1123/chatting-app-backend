export interface FriendRequestEntity {
  id: string;
  fromUser: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  createdAt: Date;
  read: boolean;
}
