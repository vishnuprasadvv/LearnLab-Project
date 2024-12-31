import express, { Router } from "express";
import { isAuthenticated, authorizeRole } from "../middlewares/authMiddleware";
import { studentHome, updateProfileImageController } from "../controllers/studentController";
import { upload } from "../../infrastructure/middlewares/multer";
import { getAllCoursesController, getCategoriesController, getCourseController, getFilteredCourses } from "../controllers/student/common/commonController";
import { handleWebhook } from "../controllers/student/order/stripeWebhookController";
import { createOrderController } from "../controllers/student/order/orderController";
import { getUserCoursesController } from "../controllers/student/profile/userCoursesController";
import { completeVideoController, getUserProgressController, markAsCompletedController, markAsIncompletedController } from "../controllers/student/course/progressController";
import { streamVideoController } from "../controllers/student/course/videoStreamController";
import { addToWishlistController, deleteFromWishlistController, getWishlistController } from "../controllers/student/wishlist/wishlistController";

const router = Router();

router.get('/home', isAuthenticated, authorizeRole(['student','instructor']), studentHome)
router.post('/profile/:id/update-image', upload.single('profileImage'), isAuthenticated, authorizeRole(['student','instructor']), updateProfileImageController)
router.get('/home/courses', getAllCoursesController)
router.get('/courses-filtered', getFilteredCourses)
router.get('/categories', getCategoriesController)
router.get('/courses/:id', getCourseController)

router.post ('/order/create',isAuthenticated, authorizeRole(['student','instructor']),createOrderController)
router.get('/profile/courses',isAuthenticated, authorizeRole(['student','instructor']), getUserCoursesController)
router.get('/progress/:courseId',isAuthenticated, authorizeRole(['student','instructor']), getUserProgressController)
router.put('/progress/:courseId/incompleted',isAuthenticated, authorizeRole(['student','instructor']), markAsIncompletedController )
router.put('/progress/:courseId/completed',isAuthenticated, authorizeRole(['student','instructor']), markAsCompletedController )
router.post('/progress/:courseId/lectures/:lectureId/videos/:videoId',isAuthenticated, authorizeRole(['student','instructor']), completeVideoController)

router.get('/stream/:courseId/:videoId', streamVideoController)
router.post('/wishlist/add',isAuthenticated, authorizeRole(['student','instructor']), addToWishlistController)
router.post('/wishlist/delete',isAuthenticated, authorizeRole(['student','instructor']), deleteFromWishlistController)
router.get('/wishlist',isAuthenticated, authorizeRole(['student','instructor']), getWishlistController)

export default router;