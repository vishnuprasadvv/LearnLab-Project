import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { CourseRepositoryClass } from "../../../../infrastructure/repositories/courseRepository";
import { GetAllCoursesAdminUseCase } from "../../../../application/use-cases/admin/courses/getAllCourses";
import { GetCourseByIdAdminUseCase } from "../../../../application/use-cases/admin/courses/getCourseById";
import { DeleteCourseAdminUseCase } from "../../../../application/use-cases/admin/courses/deleteCourse";
import { PublishCourseAdminUseCase } from "../../../../application/use-cases/admin/courses/publishCourse";

const courseRepository = new CourseRepositoryClass();
const getAllCoursesUseCase = new GetAllCoursesAdminUseCase(courseRepository);
const getCourseByIdUseCase = new GetCourseByIdAdminUseCase(courseRepository);
const deleteCourseUseCase = new DeleteCourseAdminUseCase(courseRepository);
const publishCourseUseCase = new PublishCourseAdminUseCase(courseRepository);
export const getAllCoursesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      limit = 5,
      query = "",
      page = 1,
      categories,
      sortBy,
      rating,
      level,
    } = req.query;
    const normalizedCategories =
      typeof categories === "string"
        ? categories
        : Array.isArray(categories)
        ? categories.join(",")
        : undefined;

    const normalizedSortBy = typeof sortBy === "string" ? sortBy : undefined;
    const normalizedRating = rating ? Number(rating) : undefined;
    const normalizedLevel =
      typeof level === "string"
        ? level
        : Array.isArray(categories)
        ? categories.join(",")
        : undefined;
    const normalizedQuery = query.toString();
    const normalizedPage = Number(page);
    const normalizedLimit = Number(limit) === 0 ? undefined : Number(limit);
    const result = await getAllCoursesUseCase.execute({
      query: normalizedQuery,
      categories: normalizedCategories,
      sortBy: normalizedSortBy,
      rating: normalizedRating,
      level: normalizedLevel,
      page: normalizedPage,
      limit: normalizedLimit,
    });
    res.status(200).json({
      message: "All courses fetched successfully",
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new CustomError("course id not provided", 400);
    }
    const courses = await getCourseByIdUseCase.execute(id);
    res.status(200).json({
      message: "Course fetched successfully",
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new CustomError("course id not provided", 400);
    }
    const courses = await deleteCourseUseCase.execute(id);
    res.status(200).json({
      message: "Course deleted successfully",
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

export const publishCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const { publishValue } = req.body;
    if (!courseId) {
      throw new CustomError("course id not provided", 400);
    }
    const publishedCourse = await publishCourseUseCase.execute(
      courseId,
      publishValue
    );
    if (!publishedCourse) {
      throw new CustomError("Failed to publish course", 400);
    }
    res.status(200).json({
      message: `Course ${
        publishedCourse.isPublished ? "published" : "unpublished"
      } successfully`,
      success: true,
      data: publishedCourse,
    });
  } catch (error) {
    next(error);
  }
};
