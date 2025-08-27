import { MessageModel } from "./../../infrastructure/db/models/message-model";
import { Message } from "../../domain/enities/message.enity";
import { IMessageRepository } from "../../domain/repositories/message.repository.interface";
import { GroupMessage } from "../../domain/enities/group-message.enity";
import { GroupMessageModel } from "../../infrastructure/db/models/group-message.model";

export class MessageRepository implements IMessageRepository {
  // save the mesage ( chat 1-1 )
  async save(message: Omit<Message, "id">): Promise<Message> {
    const saved = await new MessageModel(message).save();
    return {
      ...saved.toObject(),
      id: saved._id.toString(),
    };
  }

  // get chat 1-1 and chat group history
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

  // get last message in chat 1-1
  async getLastMessageBetweenUsers(
    user1Id: string,
    user2Id: string
  ): Promise<Message | null> {
    const lastMsg = await MessageModel.findOne({
      $or: [
        { fromUserId: user1Id, toUserId: user2Id },
        { fromUserId: user2Id, toUserId: user1Id },
      ],
    }).sort({ timestamp: -1 });

    return lastMsg
      ? {
          ...lastMsg.toObject(),
          id: lastMsg._id.toString(),
        }
      : null;
  }

  // get group last messgae
  async getLastMessageOfRoom(roomId: string): Promise<GroupMessage | null> {
    const lastMsg = await GroupMessageModel.findOne({ roomId }).sort({
      timestamp: -1,
    });

    return lastMsg
      ? {
          ...lastMsg.toObject(),
          id: lastMsg._id.toString(),
          senderAvatar: lastMsg.senderAvatar || "",
          edited: false,
        }
      : null;
  }

  // save group chat message
  async saveGroupMessage(
    message: Omit<GroupMessage, "id">
  ): Promise<GroupMessage> {
    const saved = await new GroupMessageModel(message).save();

    return {
      id: saved._id.toString(),
      roomId: saved.roomId,
      fromUserId: saved.fromUserId,
      senderName: saved.senderName,
      senderAvatar: saved.senderAvatar || "",
      content: saved.content,
      timestamp: saved.timestamp,
      replyTo: saved.replyTo,
      edited: false,
    };
  }

  async editMessage(id: string, content: string): Promise<Message> {
    const updated = await MessageModel.findByIdAndUpdate(
      id,
      { content, edited: true },
      { new: true }
    );

    if (!updated) {
      throw new Error(`Message with id ${id} not found`);
    }

    return {
      ...updated.toObject(),
      id: updated._id.toString(),
    };
  }

  async editGroupMessage(id: string, content: string): Promise<GroupMessage> {
    const updated = await GroupMessageModel.findByIdAndUpdate(
      id,
      { content, edited: true },
      { new: true }
    );

    if (!updated) {
      throw new Error(`Group message with id ${id} not found`);
    }

    return {
      ...updated.toObject(),
      id: updated._id.toString(),
      senderAvatar: updated.senderAvatar || undefined,
      edited: false,
    };
  }
  // dlelete message
  async deleteMessage(
    id: string,
    isGroup: boolean,
    selectUserId: string
  ): Promise<void> {
    if (isGroup) {
      await GroupMessageModel.findByIdAndDelete(id);
    } else {
      await MessageModel.findByIdAndDelete(id);
    }
  }
}
