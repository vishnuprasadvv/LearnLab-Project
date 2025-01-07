import express, { Router } from "express";
import { isAuthenticated, authorizeRole } from "../middlewares/authMiddleware";
import { studentHome, updateProfileImageController } from "../controllers/studentController";
import { upload } from "../../infrastructure/middlewares/multer";
import { getAllCoursesController, getCategoriesController, getCourseController, getFilteredCourses, getTopRatedCoursesController } from "../controllers/student/common/commonController";
import { handleWebhook } from "../controllers/student/order/stripeWebhookController";
import { createOrderController } from "../controllers/student/order/orderController";
import { getUserCoursesController } from "../controllers/student/profile/userCoursesController";
import { completeVideoController, getUserProgressController, markAsCompletedController, markAsIncompletedController } from "../controllers/student/course/progressController";
import { streamVideoController } from "../controllers/student/course/videoStreamController";
import { addToWishlistController, deleteFromWishlistController, getWishlistController, getWishlistCountController } from "../controllers/student/wishlist/wishlistController";
import { addRatingController, deleteRatingController, getCourseRatingsController, updateRatingController } from "../controllers/student/course/ratingController";

const router = Router();

router.get('/home', isAuthenticated, authorizeRole(['student','instructor']), studentHome)
router.post('/profile/:id/update-image', upload.single('profileImage'), isAuthenticated, authorizeRole(['student','instructor']), updateProfileImageController)
router.get('/home/courses', getAllCoursesController)
router.get('/home/top-rated-courses', getTopRatedCoursesController)
router.get('/courses-filtered', getFilteredCourses)
router.get('/categories', getCategoriesController)
router.get('/courses/:id', getCourseController)

router.post ('/order/create',isAuthenticated, authorizeRole(['student','instructor']),createOrderController)
router.get('/profile/courses',isAuthenticated, authorizeRole(['student','instructor']), getUserCoursesController)
router.get('/progress/:courseId',isAuthenticated, authorizeRole(['student','instructor']), getUserProgressController)
router.put('/progress/:courseId/incompleted',isAuthenticated, authorizeRole(['student','instructor']), markAsIncompletedController )
router.put('/progress/:courseId/completed',isAuthenticated, authorizeRole(['student','instructor']), markAsCompletedController )
router.post('/progress/:courseId/lectures/:lectureId/videos/:videoId',isAuthenticated, authorizeRole(['student','instructor']), completeVideoController)

//video stream routes
router.get('/stream/:courseId/:videoId', streamVideoController)

//wishlistroutes
router.use(isAuthenticated, authorizeRole(['student','instructor']),)
    .post('/wishlist/add', addToWishlistController)
    .post('/wishlist/delete',deleteFromWishlistController)
    .get('/wishlist',getWishlistController)
    .get('/wishlist/ids', getWishlistCountController)

//rating routes
router.get('/rating/:courseId', getCourseRatingsController)
router.use(isAuthenticated, authorizeRole(['student','instructor']))
    .put('/rate/:ratingId',updateRatingController)
    .delete('/rate/:ratingId', deleteRatingController)
    .post('/rate', addRatingController)
 

export default router;