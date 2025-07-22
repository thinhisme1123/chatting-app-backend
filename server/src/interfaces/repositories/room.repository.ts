import { GroupMessageModel } from './../../infrastructure/db/models/group-message.model';
// src/infrastructure/repositories/room.repository.ts
import { ChatRoom } from "../../domain/enities/chat-room.enity";
import { GroupMessage } from '../../domain/enities/group-message.enity';
import { IRoomRepository } from "../../domain/repositories/room.repository.interface";
import { RoomModel } from "../../infrastructure/db/models/room-model";
import { UserModel } from "../../infrastructure/db/models/user-model";

export class RoomRepository implements IRoomRepository {
  
  async createRoom(room: {
    name: string;
    createdBy: string;
    members: string[];
    avatar?: string;
  }): Promise<ChatRoom> {
    const createdRoom = await RoomModel.create({
      name: room.name,
      isGroup: true,
      createdBy: room.createdBy,
      members: [room.createdBy, ...room.members],
      createdAt: new Date(),
      avatar: room.avatar,
    });

    if (!createdRoom.createdBy) {
      throw new Error(
        "Phòng chat được tạo ra nhưng thiếu thông tin người tạo."
      );
    }

    const fullMembers = await UserModel.find({
      _id: { $in: createdRoom.members },
    }).select("_id username avatar");

    return {
      id: createdRoom._id.toString(),
      name: createdRoom.name,
      ownerId: createdRoom.createdBy.toString(), // 👈 FIXED
      avatar: createdRoom.avatar,
      members: fullMembers.map((u) => ({
        id: u._id.toString(),
        username: u.username,
        avatar: u.avatar,
      })),
    };
  }

  async getRoomsByUser(userId: string): Promise<ChatRoom[]> {
    const rooms = await RoomModel.find({ members: userId })
      .populate("members", "username avatar")
      .lean(); // lean() để Mongoose trả về plain JS object, không phải Document

    return rooms.map((r: any) => ({
      id: r._id.toString(),
      name: r.name,
      avatar: r.avatar,
      ownerId: r.createdBy?.toString?.() || "",

      members: Array.isArray(r.members)
        ? r.members.map((m: any) => ({
            id: m._id.toString(),
            username: m.username,
            avatar: m.avatar,
          }))
        : [],
    }));
  }

  async getMessagesByRoomId(roomId: string): Promise<GroupMessage[]> {
    const messages = await GroupMessageModel.find({ roomId })
      .sort({ timestamp: 1 })
      .lean();

    // map _id -> id để khớp với interface nếu cần
    return messages.map((msg: any) => ({
      id: msg._id.toString(),
      roomId: msg.roomId,
      fromUserId: msg.fromUserId,
      senderName: msg.senderName,
      senderAvatar: msg.senderAvatar,
      content: msg.content,
      timestamp: msg.timestamp,
    }));
  }
}
