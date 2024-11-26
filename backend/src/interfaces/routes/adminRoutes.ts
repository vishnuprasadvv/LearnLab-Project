import { Router } from "express";
import { createUserController, deleteUserController, getAllUsersController, getEditUserController, postEditUserController, toggleStatusController } from "../controllers/adminController";
import { authorizeRole, isAuthenticated } from "../middlewares/authMiddleware";

const adminRouter = Router();

adminRouter.get('/users',isAuthenticated,  authorizeRole(['admin']), getAllUsersController)
adminRouter.patch('/users/:id/status', toggleStatusController)
adminRouter.post('/users/create', createUserController)
adminRouter.get('/users/edit/:id', getEditUserController)
adminRouter.post('/users/edit/:id', postEditUserController)
 

export default adminRouter