import { Router } from "express";
import { addLectureController, createCourseController, deleteCourseController, editCourseController, editLectureController, getAllCoursesController, getCourseController, publishCourseController } from "../controllers/instructor/course/courseController";
import { upload, uploadVideo } from "../../infrastructure/middlewares/multer";
import { authorizeRole, isAuthenticated } from "../middlewares/authMiddleware";


const instructorRouter = Router();

instructorRouter.post('/courses/create', upload.single('courseImage'),isAuthenticated, authorizeRole(['instructor']), createCourseController )
instructorRouter.post('/courses/create/:courseId/lecture', uploadVideo.any() ,isAuthenticated, authorizeRole(['instructor']),addLectureController )

instructorRouter.get('/courses',isAuthenticated, authorizeRole(['instructor']), getAllCoursesController)
instructorRouter.get('/courses/:id',isAuthenticated, authorizeRole(['instructor']), getCourseController)
instructorRouter.patch('/courses/:id/delete',isAuthenticated, authorizeRole(['instructor']), deleteCourseController)
instructorRouter.patch('/courses/:id/edit', upload.single('courseImage'),isAuthenticated, authorizeRole(['instructor']), editCourseController)
instructorRouter.patch('/courses/:courseId/edit/lecture', uploadVideo.any(),isAuthenticated, authorizeRole(['instructor']), editLectureController)
instructorRouter.patch('/courses/:courseId/publish',isAuthenticated, authorizeRole(['instructor']), publishCourseController)

export default instructorRouter