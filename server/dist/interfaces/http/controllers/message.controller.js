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
exports.groupMessageSocketHandler = exports.getLastMessage = exports.getChatHistory = void 0;
const message_use_case_query_1 = require("../../../application/message/message-use-case.query");
const message_repository_1 = require("../../repositories/message.repository");
const messageUseCases = new message_use_case_query_1.MessageUseCases(new message_repository_1.MessageRepository());
const getChatHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userA, userB } = req.params;
    try {
        const history = yield messageUseCases.getChatHistory(userA, userB);
        res.status(200).json(history);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch message history" });
    }
});
exports.getChatHistory = getChatHistory;
const getLastMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user1, user2 } = req.query;
        if (!user1 || !user2 || typeof user1 !== "string" || typeof user2 !== "string") {
            res.status(400).json({ message: "Missing or invalid user IDs" });
            return;
        }
        const lastMessage = yield messageUseCases.getLastMessageBetweenUsers(user1, user2);
        res.status(200).json({ message: lastMessage });
    }
    catch (error) {
        console.error("Failed to get last message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getLastMessage = getLastMessage;
const groupMessageSocketHandler = (io, socket, messageUseCase) => {
    socket.on("send-group-message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { roomId, content, fromUserId, senderName, senderAvatar } = data;
        const timestamp = new Date();
        const savedMessage = yield messageUseCase.saveGroupMessage({
            roomId,
            fromUserId,
            senderName,
            senderAvatar,
            content,
            timestamp,
        });
        io.to(roomId).emit("receive-message", Object.assign(Object.assign({}, savedMessage), { isOwn: false }));
        console.log(`📨 Group msg in ${roomId}:`, content);
    }));
    socket.on("join-room", ({ roomId }) => {
        socket.join(roomId);
        console.log(`👥 User joined room ${roomId}`);
    });
};
exports.groupMessageSocketHandler = groupMessageSocketHandler;
