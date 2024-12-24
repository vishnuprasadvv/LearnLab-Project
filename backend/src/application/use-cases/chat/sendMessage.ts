import { IMessages } from "../../../domain/models/Messages";
import { IMessageRespository } from "../../repositories/IMessageRepository";

export class SendMessageUseCase {
    constructor(private messageRepository : IMessageRespository){}
    async execute(messageData: any) {
        return await this.messageRepository.save(messageData)
    }
}