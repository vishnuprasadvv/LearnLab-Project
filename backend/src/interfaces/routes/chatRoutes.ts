import { Router } from "express";
import { createChatController, getChatHistoryController, getChatMessagesController, getChatsController, getChatUsersController, sendMessageController } from "../controllers/student/common/chatController";
import { authorizeRole, isAuthenticated } from "../middlewares/authMiddleware";
import { upload } from "../../infrastructure/middlewares/multer";


const chatRouter = Router();

chatRouter.get('/chat/:chatId',isAuthenticated,authorizeRole(['student', 'instructor']), getChatHistoryController)

chatRouter.post('/messages/send',isAuthenticated,authorizeRole(['student', 'instructor']),upload.single('messageImage'), sendMessageController)
chatRouter.post('/create', isAuthenticated,authorizeRole(['student', 'instructor']), createChatController)

chatRouter.get('/users', isAuthenticated,authorizeRole(['student', 'instructor']), getChatUsersController)
chatRouter.get('/chats', isAuthenticated,authorizeRole(['student', 'instructor']),getChatsController)
chatRouter.get('/messages/:chatId', isAuthenticated,authorizeRole(['student', 'instructor']),getChatMessagesController)


export default chatRouter;