import { IMessages } from "../../domain/models/Messages";

export interface IMessageRespository {
     save(messageData: any):Promise<IMessages>
    findByChatId(chatId: string):Promise<IMessages[] | null>
}