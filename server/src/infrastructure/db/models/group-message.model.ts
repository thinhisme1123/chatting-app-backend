// src/infrastructure/db/models/group-message-model.ts
import mongoose from "mongoose";

const GroupMessageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  fromUserId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderAvatar: { type: String},
  content: { type: String, required: true },
  imageUrl: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
  replyTo: {
    type: {
      id: { type: String, default: null },
      content: { type: String, default: null },
      senderName: { type: String, default: null },
      imageUrl: { type: String, default: null },
    },
    default: undefined, 
    required: false, 
  },
  edited: {type: Boolean, default: false}
});

export const GroupMessageModel = mongoose.model("GroupMessage", GroupMessageSchema);
