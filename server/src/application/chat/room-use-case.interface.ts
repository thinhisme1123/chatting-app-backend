import { ChatRoom } from "../../domain/enities/chat-room.enity";
import { RoomRepository } from "../../interfaces/repositories/room.repository";

export class RoomUseCase {
  constructor(private readonly repo: RoomRepository) {}

  async createRoom(room: {
    name: string;
    createdBy: string;
    members: string[];
    avatar?: string;
  }): Promise<ChatRoom> {
    return this.repo.createRoom(room);
  }

  async getRoomsForUser(userId: string): Promise<ChatRoom[]> {
    return this.repo.getRoomsByUser(userId);
  }
}
