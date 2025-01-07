import mongoose from "mongoose";
import { Chat, IChat } from "../../domain/models/Chat";

export class ChatRepository {
    async getChatByParticipants(participants: string[]) : Promise<IChat | null>{
        return await Chat.findOne({
            participants: {$all: participants},
            chatType:'private'
        }).populate('participants', 'firstName lastName profileImageUrl role')
    }

   
    async getAllChatsByUser(userId: string):Promise<IChat[] | []>{
        const userIdObject = new mongoose.Types.ObjectId(userId)
        return await Chat.aggregate([
            {
                $match:{
                    participants:userIdObject,
                },
            },
            {
                $lookup: {
                  from: 'users', // The collection name for users
                  localField: 'participants',
                  foreignField: '_id',
                  as: 'participants',
                },
              },
            {
                $lookup: {
                    from: 'messages',
                    localField: '_id',
                    foreignField: 'chatId',
                    as: 'messages',
                }
            },
            {
                $addFields:{
                    unReadCount: {
                        $size:{
                            $filter: {
                                input: '$messages',
                                as: 'message',
                                cond:{
                                    $and: [
                                        { $eq: ["$$message.isRead", false] },
                                        { $ne: ['$$message.senderId', userIdObject]},
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {$project : {
                messages: 0,
                }
            },
            { $sort : { lastMessageSentAt: -1}},
            
        ])
    }
    async save (chatData: any):Promise<any>{
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

    async updateLastSentMessageAt(chatId: string):Promise<void>{
        await Chat.findByIdAndUpdate(chatId, {lastMessageSentAt: new Date()}, {new:true})
    }
    
    async deleteChatUser(chatId: string): Promise<boolean> {
       const result =  await Chat.findByIdAndDelete(chatId)
       if(result) {
        console.log(`Chat with ID ${chatId} deleted successfully.`)
        return true;
       }else{
        console.log(`Failed to delete chat with ID ${chatId}`)
        return false;
       }
    }
}