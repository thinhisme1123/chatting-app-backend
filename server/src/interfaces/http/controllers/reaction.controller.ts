// controllers/reaction.controller.ts
import { Request, Response } from "express";
import { MessageReactionModel } from "../../../infrastructure/db/models/messages-reaction";

export const addOrUpdateReaction = async (req: Request, res: Response) => {
  const { messageId } = req.params;
  const { userId, emoji } = req.body;

  try {
    const reaction = await MessageReactionModel.findOneAndUpdate(
      { messageId, userId },
      { emoji, createdAt: new Date() },
      { upsert: true, new: true }
    );

    res.json(reaction);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const removeReaction = async (req: Request, res: Response) => {
  const { messageId } = req.params;
  const userId = req.body;

  try {
    await MessageReactionModel.findOneAndDelete({ messageId, userId });
    res.json({ message: "Reaction removed" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
