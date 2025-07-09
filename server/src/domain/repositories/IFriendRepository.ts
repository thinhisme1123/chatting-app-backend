// domain/repositories/IFriendRepository.ts
import { User } from "../enities/user";

export interface IFriendRepository {
  sendFriendRequest(fromUserId: string, toUserId: string): Promise<any>;
  getReceivedRequests(userId: string): Promise<any[]>;
  respondToRequest(requestId: string, action: "accept" | "reject"): Promise<any>;
  getConfirmedFriends(userId: string): Promise<User[]>;
}
