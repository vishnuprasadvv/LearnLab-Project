import { IMessageRespository } from "../../repositories/IMessageRepository";

export class MarkAsReadUseCase{
    constructor(private messageRepository : IMessageRespository){}

    async execute(chatId: string, userId: string){
        return this.messageRepository.markAsRead(chatId, userId);
    }
}