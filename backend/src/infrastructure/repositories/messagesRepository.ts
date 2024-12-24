import { IMessageRespository } from "../../application/repositories/IMessageRepository";
import { IMessages, Message } from "../../domain/models/Messages";

export class MessageRepository implements IMessageRespository{
        async save(messageData: any) {
          return await Message.create(messageData);
        }
      
        async findByChatId(chatId: string):Promise<IMessages[] | null> {
          return await Message.find({ chatId: chatId }).sort({ sentAt: 1 });
        }
}