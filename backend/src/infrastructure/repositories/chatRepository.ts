import { Chat, IChat } from "../../domain/models/Chat";

export class ChatRepository {
    async getChatByParticipants(participants: string[]) {
        return await Chat.findOne({
            participants: {$all: participants},
            chatType:'private'
        }).populate('participants', 'firstName lastName profileImageUrl role')
    }

    async getAllChatsByUser(userId: string){
        return await Chat.find({
            participants:{$in:userId},
        }).populate('participants', 'firstName lastName profileImageUrl role')
    }
    async save (chatData: any){
        return await Chat.create(chatData)
    }
    async createChat (chat:IChat):Promise<IChat>{
        const result = await Chat.create(chat)
        const populatedResult = await result.populate('participants', 'firstName lastName profileImageUrl role')
        return populatedResult;
    }

    async getChatById (chatId: string) :Promise<IChat | null> {
        return await Chat.findById(chatId)
    }
}