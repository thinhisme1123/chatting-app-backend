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
exports.getGroupMessagesController = exports.getUserRoomsController = exports.createRoomController = void 0;
const room_use_case_interface_1 = require("../../../application/chat/room-use-case.interface");
const room_repository_1 = require("../../repositories/room.repository");
const roomUseCase = new room_use_case_interface_1.RoomUseCase(new room_repository_1.RoomRepository());
const createRoomController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, creatorId, memberIds, avatar, theme } = req.body;
        if (!name || !creatorId || !Array.isArray(memberIds)) {
            res.status(400).json({ message: "Thiếu thông tin tạo phòng." });
            return;
        }
        const room = yield roomUseCase.createRoom({
            name,
            createdBy: creatorId,
            members: memberIds,
            avatar,
        });
        res.status(201).json(room);
    }
    catch (err) {
        console.error("Error creating room:", err);
        res.status(500).json({ message: "Lỗi tạo phòng." });
    }
});
exports.createRoomController = createRoomController;
const getUserRoomsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const rooms = yield roomUseCase.getRoomsForUser(userId);
        res.status(200).json(rooms);
    }
    catch (err) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách phòng" });
    }
});
exports.getUserRoomsController = getUserRoomsController;
const getGroupMessagesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.params;
        const messages = yield roomUseCase.getMessagesByRoomId(roomId);
        res.status(200).json(messages);
    }
    catch (err) {
        console.error("❌ Error getting group messages:", err);
        res.status(500).json({ error: "Failed to load group messages" });
    }
});
exports.getGroupMessagesController = getGroupMessagesController;
