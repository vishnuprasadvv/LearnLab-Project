import { IMessageRespository } from "../../application/repositories/IMessageRepository";
import { IMessages, Message } from "../../domain/models/Messages";

export class MessageRepository implements IMessageRespository{
        async sendMessage(message: IMessages): Promise<IMessages> {
          return await Message.create(message);
        }
      
        async findByChatId(chatId: string):Promise<IMessages[]> {
          const messages =  await Message.find({ chatId: chatId }).sort({ sentAt: 1 });
          return messages || [];
        }
}