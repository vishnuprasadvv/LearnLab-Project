import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { CourseRepositoryClass } from "../../../../infrastructure/repositories/courseRepository";
import { GetSecureVideoUrlService } from "../../../../application/use-cases/student/videoStreamService";

const courseRepository = new CourseRepositoryClass();
const getSecureVideoUrlService = new GetSecureVideoUrlService(courseRepository);
export const streamVideoController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseId, videoId } = req.params;
    if (!courseId) throw new CustomError("Course ID not found", 400);
    if (!videoId) throw new CustomError("Video ID not found", 400);
    const secureVideoUrl = await getSecureVideoUrlService.execute(
      courseId,
      videoId
    );
    if (!secureVideoUrl){
      throw new CustomError("Video secure URL not found", 404);
    }

    res.redirect(secureVideoUrl)
    console.log('stream controller', secureVideoUrl)
  } catch (error) {
    next(error);
    console.error('video streaming controller',error)
  }
};
