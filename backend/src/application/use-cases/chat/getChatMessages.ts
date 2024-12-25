import { IMessageRespository } from "../../repositories/IMessageRepository";

export class GetChatMessagesUseCase{
    constructor(private messageRespository: IMessageRespository){}

    async execute(chatId: string) {
        if(!chatId) throw new Error('Chat ID is required.')
       return await this.messageRespository.findByChatId(chatId)
    }
}