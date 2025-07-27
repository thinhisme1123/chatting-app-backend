"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageUseCases = void 0;
class MessageUseCases {
    constructor(messageRepo) {
        this.messageRepo = messageRepo;
    }
    saveMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.messageRepo.save(message);
        });
    }
    getChatHistory(userA, userB) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.messageRepo.getChatHistory(userA, userB);
        });
    }
    getLastMessageBetweenUsers(user1Id, user2Id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.messageRepo.getLastMessageBetweenUsers(user1Id, user2Id);
        });
    }
    saveGroupMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.messageRepo.saveGroupMessage(message);
        });
    }
}
exports.MessageUseCases = MessageUseCases;
