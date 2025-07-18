// infrastructure/repositories/FriendRepository.ts
import { FriendRequestEntity } from "../../domain/enities/friend-request.enity";
import { PublicUser } from "../../domain/enities/public-user.enity";
import { IFriendRepository } from "../../domain/repositories/friend.repository.interface";
import { FriendRequestModel } from "../../infrastructure/db/models/friend-request-model";
import { UserModel } from "../../infrastructure/db/models/user-model";

export class FriendRepository implements IFriendRepository {
  async sendFriendRequest(fromUserId: string, toUserId: string) {
    const existing = await FriendRequestModel.findOne({
      fromUser: fromUserId,
      toUser: toUserId,
    });
    if (existing) throw new Error("Friend request already sent");

    const request = new FriendRequestModel({
      fromUser: fromUserId,
      toUser: toUserId,
    });
    await request.save();

    await request.populate({
      path: "fromUser",
      select: "id username email avatar", // chỉ lấy fields cần dùng
    });

    return request;
  }

  async getReceivedRequests(userId: string) {
    return await FriendRequestModel.find({
      toUser: userId,
      status: "pending",
    }).populate("fromUser", "username email avatar");
  }

  async respondToRequest(requestId: string, action: "accept" | "reject") {
    const status = action === "accept" ? "accepted" : "rejected";

    const updatedRequest = await FriendRequestModel.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    )
      .populate("fromUser") // requester
      .populate("toUser"); // receiver

    if (!updatedRequest) {
      throw new Error("Friend request not found");
    }

    // Optionally: Save both users as friends in DB (if you're not doing this yet)

    return {
      requester: updatedRequest.fromUser,
      receiver: updatedRequest.toUser,
    };
  }

  async getConfirmedFriends(userId: string): Promise<PublicUser[]> {
    const accepted = await FriendRequestModel.find({
      $or: [
        { fromUser: userId, status: "accepted" },
        { toUser: userId, status: "accepted" },
      ],
    });

    const friendIds = accepted.map((req) =>
      req.fromUser.toString() === userId ? req.toUser : req.fromUser
    );

    const friends = await UserModel.find({ _id: { $in: friendIds } }).select(
      "_id username email avatar"
    );

    return friends.map((friend) => ({
      id: friend._id.toString(),
      username: friend.username,
      email: friend.email,
      avatar: friend.avatar,
    }));
  }

  async searchUsers(
    query: string,
    currentUserId: string
  ): Promise<PublicUser[]> {
    const users = await UserModel.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
      _id: { $ne: currentUserId },
    }).select("username email avatar");

    return users.map((u) => ({
      id: u._id.toString(),
      username: u.username,
      email: u.email,
      avatar: u.avatar,
    }));
  }

  async getPendingRequests(
    currentUserId: string
  ): Promise<FriendRequestEntity[]> {
    const requests = await FriendRequestModel.find({
      toUser: currentUserId,
      status: "pending",
    }).populate("fromUser", "username email avatar");

    return requests.map((r) => {
      const fromUser = r.fromUser as any;
      return {
        id: r._id.toString(),
        fromUser: {
          id: fromUser._id.toString(),
          username: fromUser.username,
          email: fromUser.email,
          avatar: fromUser.avatar,
        },
        createdAt: r.createdAt,
        read: false,
      };
    });
  }

  // interfaces/repositories/friend.repository.ts
  async searchConfirmedFriends(
    userId: string,
    query: string
  ): Promise<PublicUser[]> {
    const accepted = await FriendRequestModel.find({
      $or: [
        { fromUser: userId, status: "accepted" },
        { toUser: userId, status: "accepted" },
      ],
    });

    const friendIds = accepted.map((req) =>
      req.fromUser.toString() === userId ? req.toUser : req.fromUser
    );

    const friends = await UserModel.find({
      _id: { $in: friendIds },
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("_id username email avatar");

    return friends.map((friend) => ({
      id: friend._id.toString(),
      username: friend.username,
      email: friend.email,
      avatar: friend.avatar,
    }));
  }
}
