// 📁 server/src/interfaces/http/controllers/message-controller.ts
import { Request, Response } from "express";
import { MessageUseCases } from "../../../application/message/message-use-case.interface";
import { MessageRepository } from "../../repositories/message.repository";

const messageUseCases = new MessageUseCases(new MessageRepository());

export const getChatHistory = async (req: Request, res: Response) => {
  const { userA, userB } = req.params;
  try {
    const history = await messageUseCases.getChatHistory(userA, userB);
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch message history" });
  }
};
export const getLastMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user1, user2 } = req.query;

    if (!user1 || !user2 || typeof user1 !== "string" || typeof user2 !== "string") {
      res.status(400).json({ message: "Missing or invalid user IDs" });
      return;
    }

    const lastMessage = await messageUseCases.getLastMessageBetweenUsers(user1, user2);

    res.status(200).json({ message: lastMessage });
  } catch (error) {
    console.error("Failed to get last message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
