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

const messageRepository = new MessageRepository();
const chatRepository = new ChatRepository()
const getChatHistory = new GetChatHistory(messageRepository);
const sendMessage = new SendMessageUseCase(messageRepository)
const userRepository = new UserRepositoryImpl();
const getAllChatUsersUseCase = new GetAllChatUsersUseCase(userRepository)
const createChatUseCase = new CreateChatUseCase(chatRepository)
const getUserChatUseCase = new GetUserChatUseCase(chatRepository)

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
        const message = 'message'
        const result = await sendMessage.execute(message)
    } catch (error) {
        next(error)
    }
}

export const getChatUsersController = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if(!user) throw new CustomError('User not found', 404)
        const users = await getAllChatUsersUseCase.execute(user.id)
        if(!users) throw new CustomError('Users not found', 404)
            res.status(200).json({success: true, message:'fetching users success', data:users})
    } catch (error) {
        next(error)
    }
}

export const createChatController = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {participants, chatType, chatName} = req.body;
        console.log(participants, chatType, chatName)
        console.log(req.body)
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