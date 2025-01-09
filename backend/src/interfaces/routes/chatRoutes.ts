import { Router } from "express";
import { createChatController, deleteChatController, getChatHistoryController, getChatMessagesController, getChatsController, getChatUsersController, markMessageAsReadController, sendMessageController } from "../controllers/student/common/chatController";
import { authorizeRole, isAuthenticated } from "../middlewares/authMiddleware";
import { upload } from "../../infrastructure/middlewares/multer";


const chatRouter = Router();

chatRouter.use(isAuthenticated,authorizeRole(['student', 'instructor']), )
    .get('/chat/:chatId', getChatHistoryController)
    .post('/messages/send',upload.single('messageImage'), sendMessageController)
    .post('/create',  createChatController)
    .delete('/delete/:chatId',  deleteChatController)

    .get('/users',  getChatUsersController)
    .get('/chats', getChatsController)
    .get('/messages/:chatId', getChatMessagesController)
    .post('/messages/markAsRead', markMessageAsReadController)



export default chatRouter;