"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const RoomSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    isGroup: { type: Boolean, default: false },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId },
    members: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    avatar: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
});
exports.RoomModel = mongoose_1.default.model('Room', RoomSchema);
