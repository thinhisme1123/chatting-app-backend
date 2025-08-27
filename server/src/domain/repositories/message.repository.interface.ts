import { GroupMessage } from "../enities/group-message.enity";
import { Message } from "../enities/message.enity";

export interface IMessageRepository {
  save(message: Omit<Message, "id">): Promise<Message>;
  getChatHistory(userA: string, userB: string): Promise<Message[]>;
  getLastMessageBetweenUsers(
    user1Id: string,
    user2Id: string
  ): Promise<Message | null>;
  saveGroupMessage(message: Omit<GroupMessage, "id">): Promise<GroupMessage>;
  getLastMessageOfRoom(roomId: string): Promise<GroupMessage | null>;
  editMessage(messageId: string, newContent: string): Promise<Message>;
  editGroupMessage(
    messageId: string,
    newContent: string
  ): Promise<GroupMessage>;
  deleteMessage(id: string, isGroup: boolean, selectUserId: string): Promise<void>
}
