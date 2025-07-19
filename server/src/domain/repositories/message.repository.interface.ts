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
}
