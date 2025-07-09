// infrastructure/repositories/FriendRepository.ts
import { IFriendRepository } from "../../domain/repositories/IFriendRepository";
import { FriendRequestModel } from "../../infrastructure/db/models/friend-request-model";
import { UserModel } from "../../infrastructure/db/models/user-model";
import {User} from "../../domain/enities/user"

export class FriendRepository implements IFriendRepository {
  async sendFriendRequest(fromUserId: string, toUserId: string) {
    const existing = await FriendRequestModel.findOne({ fromUser: fromUserId, toUser: toUserId });
    if (existing) throw new Error("Friend request already sent");

    const request = new FriendRequestModel({ fromUser: fromUserId, toUser: toUserId });
    await request.save();
    return request;
  }

  async getReceivedRequests(userId: string) {
    return await FriendRequestModel.find({ toUser: userId, status: "pending" })
      .populate("fromUser", "username email avatar");
  }

  async respondToRequest(requestId: string, action: "accept" | "reject") {
    const status = action === "accept" ? "accepted" : "rejected";
    return await FriendRequestModel.findByIdAndUpdate(requestId, { status }, { new: true });
  }

  async getConfirmedFriends(userId: string): Promise<User[]> {
    const accepted = await FriendRequestModel.find({
      $or: [
        { fromUser: userId, status: "accepted" },
        { toUser: userId, status: "accepted" },
      ],
    });

    const friendIds = accepted.map((req) =>
      req.fromUser.toString() === userId ? req.toUser : req.fromUser
    );

    const friends = await UserModel.find({ _id: { $in: friendIds } })
      .select("username email avatar");
    
    return friends;
  }
}
