"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMessageModel = void 0;
// src/infrastructure/db/models/group-message-model.ts
const mongoose_1 = __importDefault(require("mongoose"));
const GroupMessageSchema = new mongoose_1.default.Schema({
    roomId: { type: String, required: true },
    fromUserId: { type: String, required: true },
    senderName: { type: String, required: true },
    senderAvatar: { type: String },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});
exports.GroupMessageModel = mongoose_1.default.model("GroupMessage", GroupMessageSchema);
