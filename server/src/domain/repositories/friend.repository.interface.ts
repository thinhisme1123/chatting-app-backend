// domain/repositories/IFriendRepository.ts
import { FriendRequestEntity } from "../enities/friend-request.enity";
import { PublicUser } from "../enities/public-user.enity";
import { User } from "../enities/user.enity";

export interface IFriendRepository {
  sendFriendRequest(fromUserId: string, toUserId: string): Promise<any>;
  getReceivedRequests(userId: string): Promise<any[]>;
  respondToRequest(requestId: string, action: "accept" | "reject"): Promise<any>;
  getConfirmedFriends(userId: string): Promise<PublicUser[]>;
  searchUsers(query: string, currentUserId: string): Promise<PublicUser[]>;
  getPendingRequests(currentUserId: string): Promise<FriendRequestEntity[]>;
  searchConfirmedFriends(userId: string, query: string): Promise<PublicUser[]>;
}
