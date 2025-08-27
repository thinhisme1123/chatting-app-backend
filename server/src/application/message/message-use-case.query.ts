// 📁 server/src/application/usecases/MessageUseCases.ts
import { GroupMessage } from "../../domain/enities/group-message.enity";
import { Message } from "../../domain/enities/message.enity";
import { IMessageRepository } from "../../domain/repositories/message.repository.interface";

export class MessageUseCases {
  constructor(private readonly messageRepo: IMessageRepository) {}

  async saveMessage(message: Omit<Message, "id">): Promise<Message> {
    return await this.messageRepo.save(message);
  }

  async getChatHistory(userA: string, userB: string): Promise<Message[]> {
    return await this.messageRepo.getChatHistory(userA, userB);
  }

  async getLastMessageBetweenUsers(
    user1Id: string,
    user2Id: string
  ): Promise<Message | null> {
    return await this.messageRepo.getLastMessageBetweenUsers(user1Id, user2Id);
  }

  async getLastMessageOfRoom(roomId: string): Promise<GroupMessage | null> {
    return await this.messageRepo.getLastMessageOfRoom(roomId);
  }

  async saveGroupMessage(
    message: Omit<GroupMessage, "id">
  ): Promise<GroupMessage> {
    return await this.messageRepo.saveGroupMessage(message);
  }

  async editMessage(id: string, content: string): Promise<Message> {
    return this.messageRepo.editMessage(id, content);
  }

  async editGroupMessage(id: string, content: string): Promise<GroupMessage> {
    return this.messageRepo.editGroupMessage(id, content);
  }

  async deleteMessage(
    id: string,
    isGroup: boolean,
    selectUserId: string
  ) : Promise<void> {
    this.messageRepo.deleteMessage(id, isGroup, selectUserId);
  }
}
