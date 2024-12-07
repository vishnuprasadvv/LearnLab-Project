import { Router } from "express";
import { createUserController, deleteUserController, getAllUsersController, getEditUserController, postEditUserController, toggleStatusController } from "../controllers/adminController";
import { authorizeRole, isAdminAuthenticated } from "../middlewares/authMiddleware";
import { acceptInstructorApplicationHandler, getInstructorApplicationHandler, getInstructorsHandler, rejectInstructorApplicationHandler } from "../controllers/admin/instructors/instructorsAdminController.ts";
import { adminLoginHandler, adminLogoutHandler, refreshAdminTokenHandler } from "../controllers/authController";
import { createCategoryController, getAllCategoriesAtOnceController, getCategories, updateCategoryController } from "../controllers/admin/categories/categoriesController";

const adminRouter = Router();

adminRouter.post('/refresh-token', refreshAdminTokenHandler)
adminRouter.post ('/login', adminLoginHandler)
adminRouter.post('/logout', adminLogoutHandler)
adminRouter.get('/categories', getCategories)
adminRouter.get('/categories/all', getAllCategoriesAtOnceController)
adminRouter.post('/categories/add', createCategoryController)
adminRouter.put('/categories/:id/edit', updateCategoryController)

adminRouter.use(isAdminAuthenticated, authorizeRole(['admin']))
    .get('/users', getAllUsersController)
    .patch('/users/:id/status',toggleStatusController)
    .post('/users/create',createUserController)
    .route('/users/edit/:id')
    .get(getEditUserController)
    .post(postEditUserController)

 
adminRouter.use(isAdminAuthenticated, authorizeRole(['admin']))
    .get('/instructors',getInstructorsHandler)
    .get('/instructor/application/:id',getInstructorApplicationHandler)
    .post('/instructor/application/:id/accept',acceptInstructorApplicationHandler)
    .post('/instructor/application/:id/reject',rejectInstructorApplicationHandler)



export default adminRouter