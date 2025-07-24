"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
// 📁 server/src/infrastructure/db/models/message-model.ts
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    fromUserId: { type: String, required: true },
    toUserId: { type: String, required: true },
    senderName: { type: String, required: true },
    senderAvatar: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});
exports.MessageModel = mongoose_1.default.model("Message", MessageSchema);
