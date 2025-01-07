import { IChat } from "../../domain/models/Chat";

export interface IChatRepository{
    getChatByParticipants(participants: string[]) : Promise<IChat | null>
    getAllChatsByUser(userId: string):Promise<IChat[] | []>
    save (chatData: any):Promise<any>
    createChat (chat:IChat):Promise<IChat>
    getChatById (chatId: string) :Promise<IChat | null>
    updateLastSentMessageAt(chatId: string):Promise<void>
    deleteChatUser(chatId: string): Promise<boolean>
}