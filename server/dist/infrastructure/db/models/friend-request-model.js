"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRequestModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const friendRequestSchema = new mongoose_1.default.Schema({
    fromUser: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, { timestamps: true });
exports.FriendRequestModel = mongoose_1.default.model("FriendRequest", friendRequestSchema);
