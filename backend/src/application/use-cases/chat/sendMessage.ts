import { IMessages } from "../../../domain/models/Messages";
import { ChatRepository } from "../../../infrastructure/repositories/chatRepository";
import { IMessageRespository } from "../../repositories/IMessageRepository";


const chatRepository = new ChatRepository()
export class SendMessageUseCase {
    constructor(private messageRepository : IMessageRespository){}
    async execute(messageData: IMessages) {
        const sendedMessage =  await this.messageRepository.sendMessage(messageData)
        await chatRepository.updateLastSentMessageAt(messageData.chatId.toString())
        return sendedMessage;
    }
}