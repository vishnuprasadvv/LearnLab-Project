import { IMessages } from "../../domain/models/Messages";

export interface IMessageRespository {
    sendMessage(message: IMessages):Promise<IMessages>
    findByChatId(chatId: string):Promise<IMessages[] | null>
}