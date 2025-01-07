import { ChatRepository } from "../../../infrastructure/repositories/chatRepository";

export class DeleteChatUserUseCase{
    constructor(private chatRepository: ChatRepository){}
    async execute(chatId: string) {
        return await this.chatRepository.deleteChatUser(chatId)
    }
}