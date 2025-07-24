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
exports.MessageRepository = void 0;
const message_model_1 = require("./../../infrastructure/db/models/message-model");
const group_message_model_1 = require("../../infrastructure/db/models/group-message.model");
class MessageRepository {
    save(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const saved = yield new message_model_1.MessageModel(message).save();
            return Object.assign(Object.assign({}, saved.toObject()), { id: saved._id.toString() });
        });
    }
    getChatHistory(userA, userB) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield message_model_1.MessageModel.find({
                $or: [
                    { fromUserId: userA, toUserId: userB },
                    { fromUserId: userB, toUserId: userA },
                ],
            }).sort({ timestamp: 1 });
            return messages.map((msg) => (Object.assign(Object.assign({}, msg.toObject()), { id: msg._id.toString() })));
        });
    }
    getLastMessageBetweenUsers(user1Id, user2Id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastMsg = yield message_model_1.MessageModel.findOne({
                $or: [
                    { fromUserId: user1Id, toUserId: user2Id },
                    { fromUserId: user2Id, toUserId: user1Id },
                ],
            }).sort({ timestamp: -1 });
            return lastMsg ? Object.assign(Object.assign({}, lastMsg.toObject()), { id: lastMsg._id.toString() }) : null;
        });
    }
    saveGroupMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const saved = yield new group_message_model_1.GroupMessageModel(message).save();
            return {
                id: saved._id.toString(),
                roomId: saved.roomId,
                fromUserId: saved.fromUserId,
                senderName: saved.senderName,
                senderAvatar: saved.senderAvatar || '',
                content: saved.content,
                timestamp: saved.timestamp,
            };
        });
    }
}
exports.MessageRepository = MessageRepository;
