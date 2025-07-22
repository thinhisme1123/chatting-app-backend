// interfaces/http/controllers/friend.controller.ts
import { Request, Response } from "express";
import { FriendUseCase } from "../../../application/friend/friend-use-case.query";
import { FriendRepository } from "../../repositories/friend.repository";
import { FriendRequestModel } from "../../../infrastructure/db/models/friend-request-model";
import { io, onlineUsers } from "../../../server";
import { FriendRequestEntity } from "../../../domain/enities/friend-request.enity";

const friendUseCase = new FriendUseCase(new FriendRepository());

export const sendFriendRequestController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { fromUserId, toUserId } = req.body;

    const request = await friendUseCase.sendFriendRequest(fromUserId, toUserId);

    // 👇 Emit socket event to the recipient
    const targetSocketId = onlineUsers.get(toUserId);
    console.log(targetSocketId);
    
    if (targetSocketId) {
      const notification: FriendRequestEntity = {
        id: request._id.toString(),
        fromUser: {
          id: request.fromUser._id.toString(),
          username: request.fromUser.username,
          email: request.fromUser.email,
          avatar: request.fromUser.avatar || "",
        },
        createdAt: request.createdAt.toISOString(),
        read: false, // mặc định là chưa đọc
      };
      console.log(notification);
      
      io.to(targetSocketId).emit("friend-request-notification", notification);
    } else {
      console.log(`🔕 User ${toUserId} is offline`);
    }

    res.status(200).json({ message: "Friend request sent", ...request });
  } catch (err) {
    res.status(400).json({
      error:
        err instanceof Error ? err.message : "Failed to send friend request",
    });
  }
};

export const respondToFriendRequestController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { requestId, action } = req.body;

    const result = await friendUseCase.respondToRequest(requestId, action);

    // ✅ Only emit if the action is "accept"
    if (action === "accept") {
      const requesterId = result.requester.id; // người gửi lời mời
      const acceptedUser = result.receiver; // người vừa accept

      const targetSocketId = onlineUsers.get(requesterId);

      const normalizedAcceptedUser = {
        id: acceptedUser._id.toString(),
        email: acceptedUser.email,
        username: acceptedUser.username,
        avatar: acceptedUser.avatar,
        isOnline: true, 
        lastSeen: new Date(), 
        createdAt: acceptedUser.createdAt || new Date(),
      };
      // Send event to the requester (người đã gửi lời mời)
      if (targetSocketId) {
        io.to(targetSocketId).emit("friend-request-accepted", {
          newFriend: normalizedAcceptedUser,
        });
        console.log(normalizedAcceptedUser);
      } else {
        console.warn("⚠️ Requester is not online:", requesterId);
      }
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error:
        err instanceof Error
          ? err.message
          : "Failed to respond to friend request",
    });
  }
};

export const getConfirmedFriendsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.body.userId;
    const result = await friendUseCase.getConfirmedFriends(userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error:
        err instanceof Error ? err.message : "Failed to fetch friends list",
    });
  }
};

export const searchUsersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query, currentUserId } = req.body;

    if (!query) {
      res.status(400).json({ error: "Missing search query" });
      return;
    }

    const result = await friendUseCase.searchUsers(query, currentUserId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: err instanceof Error ? err.message : "Failed to search users",
    });
  }
};

export const getSentFriendRequestsController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user?.id || req.body.userId;
    const sentRequests = await FriendRequestModel.find({
      fromUser: userId,
      status: "pending",
    }).select("toUser");
    const sentToIds = sentRequests.map((req) => req.toUser.toString());
    res.status(200).json(sentToIds);
  } catch (err) {
    res.status(400).json({ error: "Failed to fetch sent friend requests" });
  }
};

export const getPendingRequestsController = async (
  req: Request,
  res: Response
) => {
  const currentUserId = req.body.currentUserId;

  const requests = await friendUseCase.getPendingRequests(currentUserId);

  res.json(requests);
};

export const searchConfirmedFriendsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, query } = req.query;
    const results = await friendUseCase.searchConfirmedFriends(
      userId as string,
      query as string
    );
    res.status(200).json(results);
  } catch (err) {
    res.status(400).json({ error: "Failed to search friends" });
  }
};
