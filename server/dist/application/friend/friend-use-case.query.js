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
exports.FriendUseCase = void 0;
class FriendUseCase {
    constructor(friendRepo) {
        this.friendRepo = friendRepo;
    }
    sendFriendRequest(fromUserId, toUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.friendRepo.sendFriendRequest(fromUserId, toUserId);
        });
    }
    getReceivedRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.friendRepo.getReceivedRequests(userId);
        });
    }
    respondToRequest(requestId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.friendRepo.respondToRequest(requestId, action);
        });
    }
    getConfirmedFriends(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.friendRepo.getConfirmedFriends(userId);
        });
    }
    searchUsers(query, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.friendRepo.searchUsers(query, currentUserId);
        });
    }
    getPendingRequests(currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.friendRepo.getPendingRequests(currentUserId);
        });
    }
    searchConfirmedFriends(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.friendRepo.searchConfirmedFriends(userId, query);
        });
    }
}
exports.FriendUseCase = FriendUseCase;
