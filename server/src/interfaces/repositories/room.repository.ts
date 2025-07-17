import { Room } from "../../domain/enities/room.enity";
import { IRoomRepository } from "../../domain/repositories/room.repository.interface";
import RoomModel from "../../infrastructure/db/models/room-model";

export class RoomRepository implements IRoomRepository {
  async createRoom(name: string, creatorId: string, memberIds: string[]): Promise<Room> {
    const room = await RoomModel.create({
      name,
      isGroup: true,
      createdBy: creatorId,
      members: [creatorId, ...memberIds],
      createdAt: new Date(),
    });

    return {
      id: room._id.toString(),
      name: room.name,
      isGroup: room.isGroup,
      createdBy: room.createdBy,
      members: room.members,
      createdAt: room.createdAt,
    };
  }
}
