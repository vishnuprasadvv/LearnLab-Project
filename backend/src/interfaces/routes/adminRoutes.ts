import { Router } from "express";
import { deleteUserController, getAllUsersController } from "../controllers/adminController";
import { authorizeRole, isAuthenticated } from "../middlewares/authMiddleware";

const adminRouter = Router();

adminRouter.get('/users', getAllUsersController)
adminRouter.delete('/user/delete/:userId', deleteUserController)




export default adminRouter