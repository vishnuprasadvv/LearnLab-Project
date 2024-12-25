
import { IChat } from "../../../domain/models/Chat";
import { ChatRepository } from "../../../infrastructure/repositories/chatRepository";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";

export class CreateChatUseCase {
    constructor(private chatRepository: ChatRepository){}

    async execute(participants: string[], chatType: 'private'| 'group', chatName?: string,):Promise<IChat>{
        if(chatType ==='private'){
            const existingChat = await this.chatRepository.getChatByParticipants(participants);
            if(existingChat) {
                console.log('chat already in db')
                throw new CustomError('Already a chat present between users.',400)
            }
        }
        

        if(chatType =='group' && !chatName){
            throw new CustomError('Chat name is required for group chats',400)
        }

        const newChat :IChat = {
            participants,
            chatType,
            chatName: chatType === 'group' ? chatName : undefined,
        }

        return await this.chatRepository.createChat(newChat)
    }
}