// models/MessageReaction.ts
import { Schema, model, Document } from "mongoose";

export interface MessageReaction extends Document {
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: Date;
}

const MessageReactionSchema = new Schema({
  messageId: { type: Schema.Types.ObjectId, ref: "Message", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  emoji: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// One reaction per user per message
MessageReactionSchema.index({ messageId: 1, userId: 1 }, { unique: true });

export const MessageReactionModel = model<MessageReaction>(
  "MessageReaction",
  MessageReactionSchema
);
