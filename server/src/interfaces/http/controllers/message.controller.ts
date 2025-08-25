// 📁 server/src/interfaces/http/controllers/message-controller.ts
import { Request, Response } from "express";
import { MessageUseCases } from "../../../application/message/message-use-case.query";
import { MessageRepository } from "../../repositories/message.repository";
import { Server, Socket } from "socket.io";

const messageUseCases = new MessageUseCases(new MessageRepository());

export const getChatHistoryController = async (req: Request, res: Response) => {
  const { userA, userB } = req.params;
  try {
    const history = await messageUseCases.getChatHistory(userA, userB);
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch message history" });
  }
};

export const getLastMessageController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user1, user2 } = req.query;

    if (
      !user1 ||
      !user2 ||
      typeof user1 !== "string" ||
      typeof user2 !== "string"
    ) {
      res.status(400).json({ message: "Missing or invalid user IDs" });
      return;
    }

    const lastMessage = await messageUseCases.getLastMessageBetweenUsers(
      user1,
      user2
    );

    res.status(200).json({ message: lastMessage });
  } catch (error) {
    console.error("Failed to get last message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const groupMessageSocketHandler = (
  io: Server,
  socket: Socket,
  messageUseCase: MessageUseCases
) => {
  socket.on("send-group-message", async (data) => {
    const { roomId, content, fromUserId, senderName, imageUrl, senderAvatar, replyTo } =
      data;
    const timestamp = new Date();

    const savedMessage = await messageUseCase.saveGroupMessage({
      roomId,
      fromUserId,
      senderName,
      senderAvatar,
      imageUrl,
      content,
      replyTo: replyTo,
      timestamp,
      edited: false
    });

    io.to(roomId).emit("receive-message", {
      ...savedMessage,
      isOwn: false,
    });
  });

  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
    console.log(`👥 User joined room ${roomId}`);
  });
};

export const getGroupLastMessageController = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const message = await messageUseCases.getLastMessageOfRoom(roomId);
  res.json(message);
};
