import { MessageModel } from "./../../infrastructure/db/models/message-model";
import { Message } from "../../domain/enities/message";

export class MessageRepository {
  async save(message: Omit<Message, "id">): Promise<Message> {
    const saved = await new MessageModel(message).save();
    return {
      ...saved.toObject(),
      id: saved._id.toString(),
    };
  }

  async getChatHistory(userA: string, userB: string): Promise<Message[]> {
    const messages = await MessageModel.find({
      $or: [
        { fromUserId: userA, toUserId: userB },
        { fromUserId: userB, toUserId: userA },
      ],
    }).sort({ timestamp: 1 });

    return messages.map((msg) => ({
      ...msg.toObject(),
      id: msg._id.toString(),
    }));
  }

  async getLastMessageBetweenUsers(user1Id: string, user2Id: string): Promise<Message | null> {
    const lastMsg = await MessageModel.findOne({
      $or: [
        { fromUserId: user1Id, toUserId: user2Id },
        { fromUserId: user2Id, toUserId: user1Id },
      ],
    }).sort({ timestamp: -1 });

    return lastMsg ? {
      ...lastMsg.toObject(),
      id: lastMsg._id.toString(),
    } : null;
  }
}
