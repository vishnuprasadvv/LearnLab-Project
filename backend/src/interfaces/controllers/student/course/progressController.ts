import { NextFunction, Request, Response } from "express";
import { ProgressUseCase } from "../../../../application/use-cases/student/courseProgress";
import { CourseProgressRepository } from "../../../../infrastructure/repositories/courseProgressRepository";
import { CustomError } from "../../../middlewares/errorMiddleWare";

const courseProgressRepository = new CourseProgressRepository();
const progressUseCase = new ProgressUseCase(courseProgressRepository);
export const getUserProgressController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { courseId } = req.params;
    if (!user) throw new CustomError("User not found", 400);
    let progress = await progressUseCase.getProgress(user.id, courseId);
    if (!progress) {
      const createdProgress = await progressUseCase.initializeProgress(
        user.id,
        courseId
      );
      progress = createdProgress;
    }
    res.status(200).json({ data: progress, success: true });
  } catch (error) {
    next(error);
  }
};

export const markAsIncompletedController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) throw new CustomError("User not found", 400);
    const { courseId } = req.params;
    if (!courseId) throw new CustomError("Course id not found", 400);
    const updateProgress = await progressUseCase.markCourseIncomplete(
      user.id,
      courseId
    );
    if (!updateProgress)
      throw new CustomError("Course progress update error", 400);
    res
      .status(200)
      .json({ success: true, message: "Course progress marked as incompleted" , data: updateProgress });
  } catch (error) {
    next(error);
  }
};
export const markAsCompletedController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) throw new CustomError("User not found", 400);
    const { courseId } = req.params;
    if (!courseId) throw new CustomError("Course id not found", 400);
    const updateProgress = await progressUseCase.markCourseComplete(
      user.id,
      courseId
    );
    if (!updateProgress)
      throw new CustomError("Course progress update error", 400);
    res
      .status(200)
      .json({ success: true, message: "Course progress marked as completed", data: updateProgress });
  } catch (error) {
    next(error);
  }
};

export const completeVideoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { courseId, lectureId, videoId } = req.params;
  try {
    if (!user) throw new CustomError("User not found", 400);
    const progress = await progressUseCase.completeVideo(
      user.id,
      courseId,
      lectureId,
      videoId
    );
    if (!progress) {
      throw new CustomError("Unable to update course progress", 400);
    }
    res
      .status(200)
      .json({
        success: true,
        data: progress,
        message: "Course progress updated",
      });
  } catch (error) {
    next(error);
  }
};
