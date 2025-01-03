import { Router } from "express";
import { addLectureController, createCourseController, deleteCourseController, editCourseController, editLectureController, getAllCoursesController, getCourseController, publishCourseController } from "../controllers/instructor/course/courseController";
import { upload, uploadVideo } from "../../infrastructure/middlewares/multer";
import { authorizeRole, isAuthenticated } from "../middlewares/authMiddleware";
import { getPurchasesController } from "../controllers/instructor/purchases/purchasesController";
import { getInstructorDashboardMetricsController, getInstructorEarningsController } from "../controllers/instructor/dashboard/dashboard";


const instructorRouter = Router();

instructorRouter.post('/courses/create', upload.single('courseImage'),isAuthenticated, authorizeRole(['instructor']), createCourseController )
instructorRouter.post('/courses/create/:courseId/lecture', uploadVideo.any() ,isAuthenticated, authorizeRole(['instructor']),addLectureController )

instructorRouter.get('/courses',isAuthenticated, authorizeRole(['instructor']), getAllCoursesController)
instructorRouter.get('/courses/:id',isAuthenticated, authorizeRole(['instructor']), getCourseController)
instructorRouter.patch('/courses/:id/delete',isAuthenticated, authorizeRole(['instructor']), deleteCourseController)
instructorRouter.patch('/courses/:id/edit', upload.single('courseImage'),isAuthenticated, authorizeRole(['instructor']), editCourseController)
instructorRouter.patch('/courses/:courseId/edit/lecture', uploadVideo.any(),isAuthenticated, authorizeRole(['instructor']), editLectureController)
instructorRouter.patch('/courses/:courseId/publish',isAuthenticated, authorizeRole(['instructor']), publishCourseController)
instructorRouter.get('/purchases',isAuthenticated, authorizeRole(['instructor']), getPurchasesController)

//instructor dashboard
instructorRouter.use(isAuthenticated, authorizeRole(['instructor']),)
    .get('/dashboard-metrics', getInstructorDashboardMetricsController)
    .get('/dashboard-earnings', getInstructorEarningsController)

export default instructorRouter