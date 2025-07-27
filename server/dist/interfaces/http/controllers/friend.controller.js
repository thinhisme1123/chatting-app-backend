"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchConfirmedFriendsController = exports.getPendingRequestsController = exports.getSentFriendRequestsController = exports.searchUsersController = exports.getConfirmedFriendsController = exports.respondToFriendRequestController = exports.sendFriendRequestController = void 0;
const friend_use_case_query_1 = require("../../../application/friend/friend-use-case.query");
const friend_repository_1 = require("../../repositories/friend.repository");
const friend_request_model_1 = require("../../../infrastructure/db/models/friend-request-model");
const server_1 = require("../../../server");
const friendUseCase = new friend_use_case_query_1.FriendUseCase(new friend_repository_1.FriendRepository());
const sendFriendRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fromUserId, toUserId } = req.body;
        const request = yield friendUseCase.sendFriendRequest(fromUserId, toUserId);
        // 👇 Emit socket event to the recipient
        const targetSocketId = server_1.onlineUsers.get(toUserId);
        console.log(targetSocketId);
        if (targetSocketId) {
            const notification = {
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
            server_1.io.to(targetSocketId).emit("friend-request-notification", notification);
        }
        else {
            console.log(`🔕 User ${toUserId} is offline`);
        }
        res.status(200).json(Object.assign({ message: "Friend request sent" }, request));
    }
    catch (err) {
        res.status(400).json({
            error: err instanceof Error ? err.message : "Failed to send friend request",
        });
    }
});
exports.sendFriendRequestController = sendFriendRequestController;
const respondToFriendRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId, action } = req.body;
        const result = yield friendUseCase.respondToRequest(requestId, action);
        // ✅ Only emit if the action is "accept"
        if (action === "accept") {
            const requesterId = result.requester.id; // người gửi lời mời
            const acceptedUser = result.receiver; // người vừa accept
            const targetSocketId = server_1.onlineUsers.get(requesterId);
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
                server_1.io.to(targetSocketId).emit("friend-request-accepted", {
                    newFriend: normalizedAcceptedUser,
                });
                console.log(normalizedAcceptedUser);
            }
            else {
                console.warn("⚠️ Requester is not online:", requesterId);
            }
        }
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({
            error: err instanceof Error
                ? err.message
                : "Failed to respond to friend request",
        });
    }
});
exports.respondToFriendRequestController = respondToFriendRequestController;
const getConfirmedFriendsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const result = yield friendUseCase.getConfirmedFriends(userId);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({
            error: err instanceof Error ? err.message : "Failed to fetch friends list",
        });
    }
});
exports.getConfirmedFriendsController = getConfirmedFriendsController;
const searchUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, currentUserId } = req.body;
        if (!query) {
            res.status(400).json({ error: "Missing search query" });
            return;
        }
        const result = yield friendUseCase.searchUsers(query, currentUserId);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({
            error: err instanceof Error ? err.message : "Failed to search users",
        });
    }
});
exports.searchUsersController = searchUsersController;
const getSentFriendRequestsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.body.userId;
        const sentRequests = yield friend_request_model_1.FriendRequestModel.find({
            fromUser: userId,
            status: "pending",
        }).select("toUser");
        const sentToIds = sentRequests.map((req) => req.toUser.toString());
        res.status(200).json(sentToIds);
    }
    catch (err) {
        res.status(400).json({ error: "Failed to fetch sent friend requests" });
    }
});
exports.getSentFriendRequestsController = getSentFriendRequestsController;
const getPendingRequestsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.body.currentUserId;
    const requests = yield friendUseCase.getPendingRequests(currentUserId);
    res.json(requests);
});
exports.getPendingRequestsController = getPendingRequestsController;
const searchConfirmedFriendsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, query } = req.query;
        const results = yield friendUseCase.searchConfirmedFriends(userId, query);
        res.status(200).json(results);
    }
    catch (err) {
        res.status(400).json({ error: "Failed to search friends" });
    }
});
exports.searchConfirmedFriendsController = searchConfirmedFriendsController;
