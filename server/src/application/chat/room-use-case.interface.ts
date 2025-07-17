import { IRoomRepository } from "../../domain/repositories/room.repository.interface";
import { Room } from "../../domain/enities/room.enity";

export class RoomUseCase {
  constructor(private readonly roomRepo: IRoomRepository) {}

  async createRoom(name: string, creatorId: string, memberIds: string[]): Promise<Room> {
    return this.roomRepo.createRoom(name, creatorId, memberIds);
  }
}
