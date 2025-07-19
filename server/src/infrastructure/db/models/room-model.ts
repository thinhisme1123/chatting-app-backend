import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isGroup: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId},
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  avatar: { type: String, default: "" }, 
  createdAt: { type: Date, default: Date.now },
});

export const RoomModel = mongoose.model('Room', RoomSchema);
