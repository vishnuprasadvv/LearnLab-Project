import { IMessages } from "../../../domain/models/Messages";
import { IMessageRespository } from "../../repositories/IMessageRepository";

export class SendMessageUseCase {
    constructor(private messageRepository : IMessageRespository){}
    async execute(messageData: IMessages) {
        return await this.messageRepository.sendMessage(messageData)
    }
}