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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlineUsers = exports.io = void 0;
// 📁 server/src/server.ts
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = require("./routes");
const message_repository_1 = require("./interfaces/repositories/message.repository");
const message_use_case_query_1 = require("./application/message/message-use-case.query");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const message_controller_1 = require("./interfaces/http/controllers/message.controller");
const messageUseCases = new message_use_case_query_1.MessageUseCases(new message_repository_1.MessageRepository());
// Load env vars
dotenv_1.default.config();
// Express setup
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
exports.io = io;
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
(0, routes_1.mainRoutes)(app);
// MongoDB Connection
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Error:", err));
// In-memory map to store userId <-> socketId
const onlineUsers = new Map();
exports.onlineUsers = onlineUsers;
// Socket.IO logic
io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);
    socket.on("register-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`✅ Registered user: ${userId} -> socket ${socket.id}`);
        io.emit("online-users", Array.from(onlineUsers.keys()));
    });
    socket.on("send-message", (_a) => __awaiter(void 0, [_a], void 0, function* ({ toUserId, fromUserId, message, senderName, senderAvatar }) {
        const newMessage = yield messageUseCases.saveMessage({
            toUserId,
            fromUserId,
            senderName,
            senderAvatar,
            content: message,
            timestamp: new Date(),
        });
        const targetSocketId = onlineUsers.get(toUserId);
        if (targetSocketId) {
            io.to(targetSocketId).emit("receive-message", newMessage);
        }
    }));
    socket.on("group-created", ({ roomId, avatar, name, members }) => {
        members.forEach((user) => {
            const socketId = onlineUsers.get(user.id);
            if (socketId) {
                io.to(socketId).emit("new-group-notification", {
                    roomId,
                    name,
                    avatar,
                    members,
                    createdAt: new Date(),
                    type: "group-invite",
                });
            }
        });
    });
    // handle save group message
    (0, message_controller_1.groupMessageSocketHandler)(io, socket, messageUseCases);
    socket.on("disconnect", () => {
        let disconnectedUserId = null;
        for (const [userId, id] of onlineUsers.entries()) {
            if (id === socket.id) {
                disconnectedUserId = userId;
                onlineUsers.delete(userId);
                break;
            }
        }
        if (disconnectedUserId) {
            console.log(`❌ User disconnected: ${disconnectedUserId}`);
        }
        else {
            console.log(`❌ Unknown socket disconnected: ${socket.id}`);
        }
        io.emit("online-users", Array.from(onlineUsers.keys()));
    });
    // handle user is typing
    socket.on("typing", ({ userId, username, toUserId }) => {
        const targetSocketId = onlineUsers.get(toUserId);
        if (targetSocketId) {
            io.to(targetSocketId).emit("user-typing", { userId, username });
        }
    });
    // Group typing handler
    socket.on("group-typing", ({ roomId, userId, username, avatar }) => {
        console.log(`✏️ User ${username} is typing in group ${roomId}`);
        io.to(roomId).emit("group-user-typing", { roomId, username, userId, avatar });
    });
    socket.on("group-stop-typing", ({ roomId, userId }) => {
        console.log(`⛔️ User ${userId} stopped typing in group ${roomId}`);
        io.to(roomId).emit("group-user-stop-typing", { roomId, userId });
    });
    socket.on("stop-typing", ({ userId, toUserId }) => {
        const targetSocketId = onlineUsers.get(toUserId);
        if (targetSocketId) {
            console.log("Stop");
            io.to(targetSocketId).emit("user-stop-typing", { userId });
        }
    });
});
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
