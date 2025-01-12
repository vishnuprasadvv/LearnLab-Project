import { NextFunction, Request, Response } from "express";
import { ICourses } from "../../../../domain/models/Courses";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { CourseRepositoryClass } from "../../../../infrastructure/repositories/courseRepository";
import { CreateCourseUseCase } from "../../../../application/use-cases/instructor/course/createCourse";
import { uploadVideoToCloudinary } from "../../../../infrastructure/cloud/cloudinary";
import { GetAllCoursesUseCase } from "../../../../application/use-cases/instructor/course/getAllCourses";
import { AddLectureUseCase } from "../../../../application/use-cases/instructor/course/addLecture";
import { GetCourseByIdUseCase } from "../../../../application/use-cases/instructor/course/getCourseById";
import { DeleteCourseUseCase } from "../../../../application/use-cases/instructor/course/deleteCourse";
import { EditCourseUseCase } from "../../../../application/use-cases/instructor/course/editCourse";
import { UpdateLectureUseCase } from "../../../../application/use-cases/instructor/course/updateLecture";
import { PublishCourseUseCase } from "../../../../application/use-cases/instructor/course/publishCourse";


const courseRepository = new CourseRepositoryClass();
const createCourseUseCase  = new CreateCourseUseCase(courseRepository)
const getAllCoursesUseCase = new GetAllCoursesUseCase(courseRepository)
const getCourseByIdUseCase = new GetCourseByIdUseCase(courseRepository)
const deleteCourseUseCase = new DeleteCourseUseCase(courseRepository)
const updateCourseUseCase = new EditCourseUseCase(courseRepository)
const publishCourseUseCase = new PublishCourseUseCase(courseRepository)


export const createCourseController = async( req: Request, res: Response, next : NextFunction) => {
    try {
        const {title, description, category , price, duration, level} : ICourses = req.body;
        const courseImage = req.file;

        const instructor = req.user
        if(!instructor || instructor.role !== 'instructor'){
            throw new CustomError('Instructor not found, try again.', 400)
        }

        if(!courseImage){
            throw new CustomError('Please select an image for course.', 400)
        }

        const newCourse = await createCourseUseCase.execute({title, description, category, price, duration, level,
            instructor: instructor.id}, courseImage.buffer)
            
        res.status(200).json({success: true, message : "Course created successfully", data: newCourse})
        
    } catch (error) {
        next (error)
    }
}

export const editCourseController = async( req: Request, res: Response, next : NextFunction) => {
    try {
      const {id} = req.params
        const {title, description, category , price, duration, level} : ICourses = req.body;
        const courseImage = req.file;

        const instructor = req.user
        if(!instructor || instructor.role !== 'instructor'){
            throw new CustomError('Instructor not found, try again.', 400)
        }


        const updatedCourse = await updateCourseUseCase.execute(id,req.body,  courseImage?.buffer)
        res.status(200).json({success: true, message : "Course updated successfully", data: updatedCourse})
        
    } catch (error) {
        next (error)
    }
}



export const getAllCoursesController = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if(!user || user.role !== 'instructor'){
        throw new CustomError('Instructor not found', 400)
      }
        const courses = await getAllCoursesUseCase.execute(user.id)
        res.status(200).json({message: 'All courses fetched successfully', success : true, data: courses})
    } catch (error) {
        next(error)
    }
}

export const getCourseController = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const {id} = req.params;
      if(!id) {
        throw new CustomError('course id not provided', 400)
      } 
        const courses = await getCourseByIdUseCase.execute(id)
        res.status(200).json({message: 'Course fetched successfully', success : true, data: courses})
    } catch (error) {
        next(error)
    }
}

export const deleteCourseController = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const {id} = req.params;
      if(!id) {
        throw new CustomError('course id not provided', 400)
      } 
        const courses = await deleteCourseUseCase.execute(id)
        res.status(200).json({message: 'Course deleted successfully', success : true, data: courses})
    } catch (error) {
        next(error)
    }
}

export const publishCourseController = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const {courseId} = req.params;
      const {publishValue} = req.body
      if(!courseId) {
        throw new CustomError('course id not provided', 400)
      } 
        const publishedCourse = await publishCourseUseCase.execute(courseId , publishValue)
        if(!publishedCourse){
          throw new CustomError('Failed to publish course', 400)
        }
        res.status(200).json({message: `Course ${publishedCourse.isPublished ? 'published' : 'unpublished'} successfully`,
           success : true, data: publishedCourse})
    } catch (error) {
        next(error)
    }
}


export const addLectureController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    if(!courseId){
      throw new Error('Course id not found')
    }

    if (!req.body || !req.files) {
      throw new Error("Invalid request data");
    }

    const { body, files } = req;

    const lecturesData: any[] = [];
    Object.keys(body).forEach((key) => {
      const match = key.match(/lectures\[(\d+)\]\.(.+)/);
      if (match) {
        const [_, lectureIndex, field] = match;
        const lectureIdx = parseInt(lectureIndex, 10);

        if (!lecturesData[lectureIdx]) {
          lecturesData[lectureIdx] = { videos: [] };
        }

        if (field.startsWith("videos[")) {
          const videoMatch = field.match(/videos\[(\d+)\]\.(.+)/);
          if (videoMatch) {
            const [__, videoIndex, videoField] = videoMatch;
            const videoIdx = parseInt(videoIndex, 10);

            if (!lecturesData[lectureIdx].videos[videoIdx]) {
              lecturesData[lectureIdx].videos[videoIdx] = {};
            }

            lecturesData[lectureIdx].videos[videoIdx][videoField] = body[key];
          }
        } else {
          lecturesData[lectureIdx][field] = body[key];
        }
      }
    });

      // Attach file data to corresponding videos
      if (Array.isArray(files)) {
        files.forEach((file: Express.Multer.File) => {
          const match = file.fieldname.match(/lectures\[(\d+)\]\.videos\[(\d+)\]\.file/);
          if (match) {
            const [_, lectureIndex, videoIndex]: any = match;
            lecturesData[lectureIndex].videos[videoIndex].file = file;
          }
        });
      } else {
        console.error("req.files is not an array. Check your multer configuration.");
      }

     // Upload videos to Cloudinary and construct final data
     const processedLectures = await Promise.all(
      lecturesData.map(async (lecture) => {
        const processedVideos = await Promise.all(
          lecture.videos.map(async (video: any) => {
            if (video.file) {
              const { secure_url, public_id } = await uploadVideoToCloudinary(video.file.buffer);
              return {
                ...video,
                url: secure_url,
                publicId: public_id,
              };
            }
            return video;
          })
        );
        return {
          ...lecture,
          videos: processedVideos,
        };
      })
    );
    const createLectureUseCase = new AddLectureUseCase(courseRepository)
    const updatedCourse = await Promise.all(
      processedLectures.map((lecture) => createLectureUseCase.execute(courseId, lecture))
    );

    res.status(201).json({
      success: true,
      message: 'Lecture created successfully',
      data: updatedCourse
    })
  }catch(error){
    next(error)
  }
}
export const editLectureController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;

    if (!req.body || !req.files) {
      throw new Error("Invalid request data");
    }

    const { body, files } = req;

    const lecturesData: any[] = [];
    Object.keys(body).forEach((key) => {
      const match = key.match(/lectures\[(\d+)\]\.(.+)/);
      if (match) {
        const [_, lectureIndex, field] = match;
        const lectureIdx = parseInt(lectureIndex, 10);

        if (!lecturesData[lectureIdx]) {
          lecturesData[lectureIdx] = { videos: [] };
        }

        if (field.startsWith("videos[")) {
          const videoMatch = field.match(/videos\[(\d+)\]\.(.+)/);
          if (videoMatch) {
            const [__, videoIndex, videoField] = videoMatch;
            const videoIdx = parseInt(videoIndex, 10);

            if (!lecturesData[lectureIdx].videos[videoIdx]) {
              lecturesData[lectureIdx].videos[videoIdx] = {};
            }

            lecturesData[lectureIdx].videos[videoIdx][videoField] = body[key];
          }
        } else {
          lecturesData[lectureIdx][field] = body[key];
        }
      }
    });

      // Attach file data to corresponding videos
      if (files && Array.isArray(files)) {
        files.forEach((file: Express.Multer.File) => {
          const match = file.fieldname.match(/lectures\[(\d+)\]\.videos\[(\d+)\]\.file/);
          if (match) {
            const [_, lectureIndex, videoIndex]: any = match;
            const lectureIdx = parseInt(lectureIndex, 10);
          const videoIdx = parseInt(videoIndex, 10);

          if (lecturesData[lectureIdx] && lecturesData[lectureIdx].videos[videoIdx]) {
            lecturesData[lectureIdx].videos[videoIdx].file = file;
          }
          }
        });
      } else {
        console.error("req.files is not an array. Check your multer configuration.");
      }

     // Upload videos to Cloudinary and construct final data
      const processedLectures:any = await Promise.all(
        lecturesData.map(async (lecture) => {
          const processedVideos = await Promise.all(
            lecture.videos.map(async (video: any) => {

              if (video.file &&  typeof video.file === "object" &&
                "buffer" in video.file &&
                "originalname" in video.file) {
                const { secure_url, public_id } = await uploadVideoToCloudinary(video.file.buffer);
                return {
                  ...video,
                  url: secure_url,
                  publicId: public_id,
                };
              }

              //if video has a URL 
              if(typeof video.file ==='string' && video.file.startsWith('http')){
                return {...video, url :video.file}
              }
              return video;
            })
          );
          return {
            ...lecture,
            videos: processedVideos,
          };
        })
      );
    const updateLectureUseCase = new UpdateLectureUseCase(courseRepository)
    const updatedCourse = await updateLectureUseCase.execute(courseId, processedLectures)

    res.status(201).json({
      success: true,
      message: 'Lecture edited successfully',
      data: updatedCourse
    })
  }catch(error){
    next(error)
  }
}