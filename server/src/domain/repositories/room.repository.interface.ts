// src/domain/repositories/room.repository.interface.ts
import { ChatRoom } from "../enities/chat-room.enity";

export interface IRoomRepository {
  createRoom(room: {
    name: string;
    createdBy: string;
    members: string[];
    avatar?: string;
  }): Promise<ChatRoom>;
}
