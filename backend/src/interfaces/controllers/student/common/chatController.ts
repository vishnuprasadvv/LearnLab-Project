import { NextFunction, Request, Response } from "express";
import { GetChatHistory } from "../../../../application/use-cases/chat/getChatHistory";
import { SendMessageUseCase } from "../../../../application/use-cases/chat/sendMessage";
import { MessageRepository } from "../../../../infrastructure/repositories/messagesRepository";
import { GetAllChatUsersUseCase } from "../../../../application/use-cases/chat/getAllChatUsers";
import { UserRepositoryImpl } from "../../../../infrastructure/repositories/userRepositoryImpl";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { CreateChatUseCase } from "../../../../application/use-cases/chat/createChat";
import { ChatRepository } from "../../../../infrastructure/repositories/chatRepository";
import { GetUserChatUseCase } from "../../../../application/use-cases/chat/getUserChat";
import { GetChatMessagesUseCase } from "../../../../application/use-cases/chat/getChatMessages";
import { IMessages } from "../../../../domain/models/Messages";
import { uploadChatImage } from "../../../../infrastructure/cloud/cloudinary";
import { MarkAsReadUseCase } from "../../../../application/use-cases/chat/markAsRead";
import { io } from "../../../../main/server";
import { DeleteChatUserUseCase } from "../../../../application/use-cases/student/deleteChat";

const messageRepository = new MessageRepository();
const chatRepository = new ChatRepository()
const getChatHistory = new GetChatHistory(messageRepository);
const sendMessageUseCase = new SendMessageUseCase(messageRepository)
const userRepository = new UserRepositoryImpl();
const getAllChatUsersUseCase = new GetAllChatUsersUseCase(userRepository)
const createChatUseCase = new CreateChatUseCase(chatRepository)
const getUserChatUseCase = new GetUserChatUseCase(chatRepository)
const getChatMessagesUseCase = new GetChatMessagesUseCase(messageRepository)
const markAsReadUseCase = new MarkAsReadUseCase(messageRepository)

export const getChatHistoryController = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const chatId = req.query
        if(!chatId) throw new CustomError('chat not found', 400)

        const result = await getChatHistory.execute(chatId.toString())
    } catch (error) {
        next(error)
    }
}
export const sendMessageController = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {senderId, replyToMessageId, messageText, chatId} = req.body;
        if(!senderId || !chatId) {
            throw new CustomError('Sender ID and Chat ID are required', 400)
        }
        let image = null;
        let imagePublicUrl = null;
        if(req.file){
            const imageUploadResult = await uploadChatImage(req.file.buffer)
            image = imageUploadResult.secure_url;
            imagePublicUrl = imageUploadResult.public_id
        }
        const messageData : IMessages ={
            senderId,
            replyToMessageId : replyToMessageId || null,
            messageText,
            image: image || null,
            imagePublicUrl : imagePublicUrl || null,
            isRead: false,
            sentAt: new Date(),
            chatId
        }
        const result = await sendMessageUseCase.execute(messageData)
        if(!result) throw new CustomError('Error sending message', 400)
        res.status(200).json({success: true, message: 'Message send successfully', data:result })
    } catch (error) {
        next(error)
    }
}

export const getChatUsersController = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if(!user) throw new CustomError('User not found', 404)
        const users = await getAllChatUsersUseCase.execute(user.id, user.role)
        if(!users) throw new CustomError('Users not found', 404)
            res.status(200).json({success: true, message:'fetching users success', data:users})
    } catch (error) {
        next(error)
    }
}

export const createChatController = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {participants, chatType, chatName} = req.body;
        if (!participants || !Array.isArray(participants) || participants.length < 2) {
            throw new CustomError("Participants array must contain at least 2 user IDs.", 400);
          }

          if (!chatType || (chatType !== "private" && chatType !== "group")) {
            throw new CustomError("Invalid chat type. Must be 'private' or 'group'.", 400);
          }
           // For private chats, ignore `chatName`
    if (chatType === "private" && chatName) {
        throw new CustomError("Chat name is not allowed for private chats.", 400);
      }
        const chat = await createChatUseCase.execute(participants, chatType, chatName)
        if(!chat) throw new CustomError('Users not found', 404)
            res.status(200).json({success: true, message:'New chat created', data:chat})
    } catch (error) {
        next(error)
    }
}

export const getChatsController = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if(!user) throw new CustomError('User not found', 400)
        const chat = await getUserChatUseCase.execute(user.id)
        if(!chat) throw new CustomError('chat not found', 404)
            res.status(200).json({success: true, message:'fetching chats success', data:chat})
    } catch (error) {
        next(error)
    }
}
export const getChatMessagesController = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {chatId} = req.params;
        if(!chatId) throw new CustomError('Chat id not found', 400);
        const messages = await getChatMessagesUseCase.execute(chatId)
        if(!messages) throw new CustomError('chat not found', 404)
            res.status(200).json({success: true, message:'fetching chat message success', data:messages})
    } catch (error) {
        next(error)
    }
}

export const markMessageAsReadController = async(req:Request, res: Response, next:NextFunction) => {
try {
    const {chatId, userId} = req.body;
    if(!chatId) {
        throw new CustomError('Chat ID required', 400)
    }
    if(!userId) throw new CustomError('User ID is required', 400)
    const markAsRead = await markAsReadUseCase.execute(chatId, userId)
    if(!markAsRead) throw new CustomError('Error marking messages as read', 400)

    io.to(chatId).emit('messagesRead', {chatId})
    
        res.status(200).json({success: true})
} catch (error) {
    next(error)
}
}


export const deleteChatController = async( req: Request, res: Response, next: NextFunction) => {
    try {
        const {chatId} = req.params;
        if(!chatId) throw new CustomError('Chat ID is required', 400);
        const useCase = new DeleteChatUserUseCase(chatRepository);
        await useCase.execute(chatId);
        res.status(200).json({ success: true, message: 'Chat is deleted successfully'})
    } catch (error) {
        next(error)
    }
}