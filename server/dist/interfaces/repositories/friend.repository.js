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
exports.FriendRepository = void 0;
const friend_request_model_1 = require("../../infrastructure/db/models/friend-request-model");
const user_model_1 = require("../../infrastructure/db/models/user-model");
class FriendRepository {
    sendFriendRequest(fromUserId, toUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield friend_request_model_1.FriendRequestModel.findOne({
                fromUser: fromUserId,
                toUser: toUserId,
            });
            if (existing)
                throw new Error("Friend request already sent");
            const request = new friend_request_model_1.FriendRequestModel({
                fromUser: fromUserId,
                toUser: toUserId,
            });
            yield request.save();
            yield request.populate({
                path: "fromUser",
                select: "id username email avatar", // chỉ lấy fields cần dùng
            });
            return request;
        });
    }
    getReceivedRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield friend_request_model_1.FriendRequestModel.find({
                toUser: userId,
                status: "pending",
            }).populate("fromUser", "username email avatar");
        });
    }
    respondToRequest(requestId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = action === "accept" ? "accepted" : "rejected";
            const updatedRequest = yield friend_request_model_1.FriendRequestModel.findByIdAndUpdate(requestId, { status }, { new: true })
                .populate("fromUser")
                .populate("toUser");
            if (!updatedRequest) {
                throw new Error("Friend request not found");
            }
            return {
                requester: updatedRequest.fromUser,
                receiver: updatedRequest.toUser,
            };
        });
    }
    getConfirmedFriends(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accepted = yield friend_request_model_1.FriendRequestModel.find({
                $or: [
                    { fromUser: userId, status: "accepted" },
                    { toUser: userId, status: "accepted" },
                ],
            });
            const friendIds = accepted.map((req) => req.fromUser.toString() === userId ? req.toUser : req.fromUser);
            const friends = yield user_model_1.UserModel.find({ _id: { $in: friendIds } }).select("_id username email avatar");
            return friends.map((friend) => ({
                id: friend._id.toString(),
                username: friend.username,
                email: friend.email,
                avatar: friend.avatar,
            }));
        });
    }
    searchUsers(query, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_model_1.UserModel.find({
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
        });
    }
    getPendingRequests(currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = yield friend_request_model_1.FriendRequestModel.find({
                toUser: currentUserId,
                status: "pending",
            }).populate("fromUser", "username email avatar");
            return requests.map((r) => {
                const fromUser = r.fromUser;
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
        });
    }
    // interfaces/repositories/friend.repository.ts
    searchConfirmedFriends(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const accepted = yield friend_request_model_1.FriendRequestModel.find({
                $or: [
                    { fromUser: userId, status: "accepted" },
                    { toUser: userId, status: "accepted" },
                ],
            });
            const friendIds = accepted.map((req) => req.fromUser.toString() === userId ? req.toUser : req.fromUser);
            const friends = yield user_model_1.UserModel.find({
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
        });
    }
}
exports.FriendRepository = FriendRepository;
