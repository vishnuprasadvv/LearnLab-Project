import { Router } from "express";
import { createCourseController, createCourseLectureController, getAllCoursesController } from "../controllers/instructor/course/courseController";
import { upload, uploadVideo } from "../../infrastructure/middlewares/multer";
import { authorizeRole, isAuthenticated } from "../middlewares/authMiddleware";


const instructorRouter = Router();

instructorRouter.post('/courses/create', upload.single('courseImage'),isAuthenticated, authorizeRole(['instructor']), createCourseController )
instructorRouter.post('/courses/create/:courseId/lecture', uploadVideo.any() ,isAuthenticated, authorizeRole(['instructor']),createCourseLectureController )

instructorRouter.get('/courses', getAllCoursesController)

export default instructorRouter