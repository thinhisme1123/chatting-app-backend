// 📁 server/src/application/usecases/MessageUseCases.ts
import { MessageRepository } from "../../interfaces/repositories/message.repository";
import { Message } from "../../domain/enities/message";

export class MessageUseCases {
  constructor(private messageRepo: MessageRepository) {}

  async saveMessage(message: Omit<Message, "id">): Promise<Message> {
    return await this.messageRepo.save(message);
  }

  async getChatHistory(userA: string, userB: string): Promise<Message[]> {
    return await this.messageRepo.getChatHistory(userA, userB);
  }

  async getLastMessageBetweenUsers(user1Id: string, user2Id: string): Promise<Message | null> {
    return await this.messageRepo.getLastMessageBetweenUsers(user1Id, user2Id);
  }
}
