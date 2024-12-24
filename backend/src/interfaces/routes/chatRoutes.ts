import { Router } from "express";
import { createChatController, getChatHistoryController, getChatsController, getChatUsersController, sendMessageController } from "../controllers/student/common/chatController";
import { authorizeRole, isAuthenticated } from "../middlewares/authMiddleware";


const chatRouter = Router();

chatRouter.get('/chat/:chatId', getChatHistoryController)

chatRouter.post('/', sendMessageController)
chatRouter.post('/create', isAuthenticated,authorizeRole(['student', 'instructor']), createChatController)

chatRouter.get('/users', isAuthenticated,authorizeRole(['student', 'instructor']), getChatUsersController)
chatRouter.get('/chats', isAuthenticated,authorizeRole(['student', 'instructor']),getChatsController)


export default chatRouter;