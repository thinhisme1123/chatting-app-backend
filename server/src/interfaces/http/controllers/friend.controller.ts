// interfaces/http/controllers/friend.controller.ts
import { Request, Response } from 'express';
import { FriendUseCase } from '../../../application/friend/friend-use-case.interface';
import { FriendRepository } from '../../repositories/friend.repository';
import { UserModel } from '../../../infrastructure/db/models/user-model';
import { FriendRequestModel } from '../../../infrastructure/db/models/friend-request-model';

const friendUseCase = new FriendUseCase(new FriendRepository());

export const sendFriendRequestController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fromUserId, toUserId } = req.body;
    const result = await friendUseCase.sendFriendRequest(fromUserId, toUserId);
    res.status(200).json({ message: 'Friend request sent', ...result });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Failed to send friend request' });
  }
};

export const respondToFriendRequestController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { requestId, action } = req.body;
    const result = await friendUseCase.respondToRequest(requestId, action);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Failed to respond to friend request' });
  }
};

export const getConfirmedFriendsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const result = await friendUseCase.getConfirmedFriends(userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Failed to fetch friends list' });
  }
};

export const searchUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, currentUserId } = req.body;

    if (!query) {
      res.status(400).json({ error: "Missing search query" });
      return;
    }

    const users = await UserModel.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
      _id: { $ne: currentUserId },
    }).select("username email avatar");

    // ✅ Map lại dữ liệu cho rõ ràng, frontend dễ dùng
    const formattedUsers = users.map((u) => ({
      id: u._id.toString(),
      username: u.username,
      email: u.email,
      avatar: u.avatar,
    }));

    res.status(200).json(formattedUsers);
  } catch (err) {
    res.status(400).json({
      error: err instanceof Error ? err.message : "Failed to search users",
    });
  }
};

export const getSentFriendRequestsController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.body.userId;
    const sentRequests = await FriendRequestModel.find({ fromUser: userId, status: "pending" }).select("toUser");
    const sentToIds = sentRequests.map((req) => req.toUser.toString());
    res.status(200).json(sentToIds);
  } catch (err) {
    res.status(400).json({ error: "Failed to fetch sent friend requests" });
  }
};




