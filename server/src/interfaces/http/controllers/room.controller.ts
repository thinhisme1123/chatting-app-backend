import { Request, Response } from "express";
import { RoomUseCase } from "../../../application/chat/room-use-case.interface";
import { RoomRepository } from "../../repositories/room.repository";

const roomUseCase = new RoomUseCase(new RoomRepository());

export const createRoomController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, creatorId, memberIds, avatar, theme } = req.body;
    console.log(theme);
    
    if (!name || !creatorId || !Array.isArray(memberIds)) {
      res.status(400).json({ message: "Thiếu thông tin tạo phòng." });
      return;
    }

    const room = await roomUseCase.createRoom({
      name,
      createdBy: creatorId,
      members: memberIds,
      avatar,
    });

    res.status(201).json(room);
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ message: "Lỗi tạo phòng." });
  }
};

export const getUserRoomsController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const rooms = await roomUseCase.getRoomsForUser(userId);
    console.log(userId);
    console.log(rooms);
    
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách phòng" });
  }
};
