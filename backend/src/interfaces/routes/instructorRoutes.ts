import { Router } from "express";
import { addLectureController, createCourseController, deleteCourseController, editCourseController, editLectureController, getAllCoursesController, getCourseController, publishCourseController } from "../controllers/instructor/course/courseController";
import { upload, uploadVideo } from "../../infrastructure/middlewares/multer";
import { authorizeRole, isAuthenticated } from "../middlewares/authMiddleware";
import { getPurchasesController } from "../controllers/instructor/purchases/purchasesController";
import { getInstructorDashboardMetricsController, getInstructorEarningsController } from "../controllers/instructor/dashboard/dashboard";


const instructorRouter = Router();

instructorRouter.use(isAuthenticated, authorizeRole(['instructor']),)
    .post('/courses/create', upload.single('courseImage'), createCourseController )
    .post('/courses/create/:courseId/lecture', uploadVideo.any() ,addLectureController )
    .get('/courses', getAllCoursesController)
    .get('/courses/:id', getCourseController)
    .patch('/courses/:id/delete', deleteCourseController)
    .patch('/courses/:id/edit', upload.single('courseImage'), editCourseController)
    .patch('/courses/:courseId/edit/lecture', uploadVideo.any(), editLectureController)
    .patch('/courses/:courseId/publish', publishCourseController)
    .get('/purchases', getPurchasesController)


//instructor dashboard
instructorRouter.use(isAuthenticated, authorizeRole(['instructor']),)
    .get('/dashboard-metrics', getInstructorDashboardMetricsController)
    .get('/dashboard-earnings', getInstructorEarningsController)

export default instructorRouter