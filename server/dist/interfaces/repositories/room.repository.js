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
exports.RoomRepository = void 0;
const group_message_model_1 = require("./../../infrastructure/db/models/group-message.model");
const room_model_1 = require("../../infrastructure/db/models/room-model");
const user_model_1 = require("../../infrastructure/db/models/user-model");
class RoomRepository {
    createRoom(room) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdRoom = yield room_model_1.RoomModel.create({
                name: room.name,
                isGroup: true,
                createdBy: room.createdBy,
                members: [room.createdBy, ...room.members],
                createdAt: new Date(),
                avatar: room.avatar,
            });
            if (!createdRoom.createdBy) {
                throw new Error("Phòng chat được tạo ra nhưng thiếu thông tin người tạo.");
            }
            const fullMembers = yield user_model_1.UserModel.find({
                _id: { $in: createdRoom.members },
            }).select("_id username avatar");
            return {
                id: createdRoom._id.toString(),
                name: createdRoom.name,
                ownerId: createdRoom.createdBy.toString(), // 👈 FIXED
                avatar: createdRoom.avatar,
                members: fullMembers.map((u) => ({
                    id: u._id.toString(),
                    username: u.username,
                    avatar: u.avatar,
                })),
            };
        });
    }
    getRoomsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rooms = yield room_model_1.RoomModel.find({ members: userId })
                .populate("members", "username avatar")
                .lean(); // lean() để Mongoose trả về plain JS object, không phải Document
            return rooms.map((r) => {
                var _a, _b;
                return ({
                    id: r._id.toString(),
                    name: r.name,
                    avatar: r.avatar,
                    ownerId: ((_b = (_a = r.createdBy) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a)) || "",
                    members: Array.isArray(r.members)
                        ? r.members.map((m) => ({
                            id: m._id.toString(),
                            username: m.username,
                            avatar: m.avatar,
                        }))
                        : [],
                });
            });
        });
    }
    getMessagesByRoomId(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield group_message_model_1.GroupMessageModel.find({ roomId })
                .sort({ timestamp: 1 })
                .lean();
            // map _id -> id để khớp với interface nếu cần
            return messages.map((msg) => ({
                id: msg._id.toString(),
                roomId: msg.roomId,
                fromUserId: msg.fromUserId,
                senderName: msg.senderName,
                senderAvatar: msg.senderAvatar,
                content: msg.content,
                timestamp: msg.timestamp,
            }));
        });
    }
}
exports.RoomRepository = RoomRepository;
