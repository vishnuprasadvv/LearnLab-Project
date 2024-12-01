import { Router } from "express";
import { createUserController, deleteUserController, getAllUsersController, getEditUserController, postEditUserController, toggleStatusController } from "../controllers/adminController";
import { authorizeRole, isAdminAuthenticated } from "../middlewares/authMiddleware";
import { acceptInstructorApplicationHandler, getInstructorApplicationHandler, getInstructorsHandler, rejectInstructorApplicationHandler } from "../controllers/admin/instructors/instructorsAdminController.ts";
import { adminLoginHandler, adminLogoutHandler, refreshAdminTokenHandler } from "../controllers/authController";

const adminRouter = Router();

adminRouter.post('/refresh-token', refreshAdminTokenHandler)

adminRouter.get('/users',isAdminAuthenticated,  authorizeRole(['admin']), getAllUsersController)
adminRouter.patch('/users/:id/status',isAdminAuthenticated,  authorizeRole(['admin']), toggleStatusController)
adminRouter.post('/users/create',isAdminAuthenticated,  authorizeRole(['admin']), createUserController)
adminRouter.get('/users/edit/:id',isAdminAuthenticated,  authorizeRole(['admin']), getEditUserController)
adminRouter.post('/users/edit/:id',isAdminAuthenticated,  authorizeRole(['admin']), postEditUserController)

adminRouter.post ('/login', adminLoginHandler)

adminRouter.post('/logout', adminLogoutHandler)
//instructors
adminRouter.get('/instructors',isAdminAuthenticated,  authorizeRole(['admin']), getInstructorsHandler )
adminRouter.get('/instructor/application/:id',isAdminAuthenticated,  authorizeRole(['admin']), getInstructorApplicationHandler )
adminRouter.post('/instructor/application/:id/accept',isAdminAuthenticated,  authorizeRole(['admin']), acceptInstructorApplicationHandler )
adminRouter.post('/instructor/application/:id/reject',isAdminAuthenticated,  authorizeRole(['admin']), rejectInstructorApplicationHandler )
 

export default adminRouter