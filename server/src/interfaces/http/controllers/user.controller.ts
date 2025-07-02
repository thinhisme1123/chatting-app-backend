// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { UserModel } from "../../../infrastructure/db/models/user-model";

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const avatarUrl = (req.file as any)?.path;

    await UserModel.findByIdAndUpdate(userId, { avatar: avatarUrl });

    res.json({ success: true, avatar: avatarUrl });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload avatar" });
  }
};
