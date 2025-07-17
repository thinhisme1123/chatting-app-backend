import { Request, Response } from "express";
import { RoomUseCase } from "../../../application/chat/room-use-case.interface";
import { RoomRepository } from "../../repositories/room.repository";

const roomUseCase = new RoomUseCase(new RoomRepository());

export const createRoomController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, creatorId, memberIds } = req.body;

    if (!name || !creatorId || !Array.isArray(memberIds)) {
      res.status(400).json({ message: "Thiếu thông tin tạo phòng." });
      return;
    }

    const room = await roomUseCase.createRoom(name, creatorId, memberIds);
    res.status(201).json(room);
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ message: "Lỗi tạo phòng." });
  }
};
