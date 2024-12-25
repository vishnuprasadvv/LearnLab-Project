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

        async markAsRead (chatId: string, userId: string) : Promise<string> {
          try {
            const result = await Message.updateMany(
                { chatId: chatId, senderId: { $ne: userId }, isRead: false },
                { $set: { isRead: true } }
            );
    
            if (result.matchedCount === 0) {
                return 'No messages found to mark as read';
            }
    
            if (result.modifiedCount === 0) {
                return 'Messages were already marked as read';
            }
    
            return 'Messages successfully marked as read';
        } catch (error) {
            console.error('Error in markAsRead service:', error);
            throw new Error('Failed to mark messages as read');
        }
        }
}