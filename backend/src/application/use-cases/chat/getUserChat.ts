import { ChatRepository } from "../../../infrastructure/repositories/chatRepository";

export class GetUserChatUseCase{
    constructor(private chatRepository: ChatRepository){}

    async execute(userId: string){
        return this.chatRepository.getAllChatsByUser(userId)
    }
}