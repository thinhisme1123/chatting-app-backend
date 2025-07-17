import { Room } from './../enities/room.enity';

export interface IRoomRepository {
  createRoom(
    name: string,
    creatorId: string,
    memberIds: string[]
  ): Promise<Room>;
}
