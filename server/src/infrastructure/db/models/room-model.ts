import mongoose, { Schema } from "mongoose";

const RoomSchema = new Schema(
  {
    name: { type: String, required: true },
    isGroup: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    members: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const RoomModel = mongoose.model("Room", RoomSchema);
export default RoomModel;
