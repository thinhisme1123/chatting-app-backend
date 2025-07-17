// application/friend/FriendUseCase.ts
import { PublicUser } from "../../domain/enities/public-user.enity";
import { IFriendRepository } from "../../domain/repositories/friend.repository.interface";

export class FriendUseCase {
  constructor(private friendRepo: IFriendRepository) {}

  async sendFriendRequest(fromUserId: string, toUserId: string) {
    return await this.friendRepo.sendFriendRequest(fromUserId, toUserId);
  }

  async getReceivedRequests(userId: string) {
    return await this.friendRepo.getReceivedRequests(userId);
  }

  async respondToRequest(requestId: string, action: "accept" | "reject") {
    return await this.friendRepo.respondToRequest(requestId, action);
  }

  async getConfirmedFriends(userId: string) {
    return await this.friendRepo.getConfirmedFriends(userId);
  }

  async searchUsers(
    query: string,
    currentUserId: string
  ): Promise<PublicUser[]> {
    return await this.friendRepo.searchUsers(query, currentUserId);
  }

  async getPendingRequests(currentUserId: string) {
    return this.friendRepo.getPendingRequests(currentUserId);
  }

  async searchConfirmedFriends(
    userId: string,
    query: string
  ): Promise<PublicUser[]> {
    return this.friendRepo.searchConfirmedFriends(userId, query);
  }
}
