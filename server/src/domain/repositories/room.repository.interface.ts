// src/domain/repositories/room.repository.interface.ts
import { ChatRoom } from "../enities/chat-room.enity";
import { GroupMessage } from "../enities/group-message.enity";

export interface IRoomRepository {
  createRoom(room: {
    name: string;
    createdBy: string;
    members: string[];
    avatar?: string;
  }): Promise<ChatRoom>;
  getRoomsByUser(userId: string): Promise<ChatRoom[]>;
  getMessagesByRoomId(roomId: string): Promise<GroupMessage[]>;
}
