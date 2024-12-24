import { IMessages } from "../../../domain/models/Messages";
import { IMessageRespository } from "../../repositories/IMessageRepository";

export class GetChatHistory {
    constructor(private messageRepository : IMessageRespository) {}

   async execute (chatId:string) {
    return await this.messageRepository.findByChatId(chatId)
   }
}