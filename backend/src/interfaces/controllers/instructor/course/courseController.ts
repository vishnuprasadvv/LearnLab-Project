import { NextFunction, Request, Response } from "express";
import { ICourses } from "../../../../domain/models/Courses";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { CourseRepositoryClass } from "../../../../infrastructure/repositories/courseRespository";
import { CreateCourseUseCase } from "../../../../application/use-cases/instructor/course/createCourse";
import { uploadVideoToCloudinary } from "../../../../infrastructure/cloud/cloudinary";
import { GetAllCoursesUseCase } from "../../../../application/use-cases/instructor/course/getAllCourses";
import { CreateLectureUseCase } from "../../../../application/use-cases/instructor/course/createLecture";
import { LectureRepositoryClass } from "../../../../infrastructure/repositories/lectureRepository";
import { MongooseTransactionManager } from "../../../../infrastructure/repositories/transactionRepository";


const courseRepository = new CourseRepositoryClass();
const createCourseUseCase  = new CreateCourseUseCase(courseRepository)
const getAllCoursesUseCase = new GetAllCoursesUseCase(courseRepository)
const lectureRepository = new LectureRepositoryClass();
const transactoinManager = new MongooseTransactionManager();

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
            
        console.log(newCourse)
        res.status(200).json({success: true, message : "Course created successfully", data: newCourse})
        
    } catch (error) {
        next (error)
    }
}

export const createCourseLectureController = async( req: Request, res: Response, next : NextFunction) => {
    try {
        console.log(req.body)
        console.log(req.files)
        const {courseId} = req.params
        console.log('courseId --' , courseId)
        const { body, files } = req;

        if(!files) throw new CustomError('Files not provided', 400)

        // Parse lectures and videos from req.body
        const lecturesData: any[] = [];
        Object.keys(body).forEach((key) => {
          const match = key.match(/lectures\[(\d+)\]\.(.+)/);
          if (match) {
            const [_, lectureIndex, field] = match;
            const lectureIdx = parseInt(lectureIndex, 10);
    
            if (!lecturesData[lectureIdx]) {
              lecturesData[lectureIdx] = { videos: [] };
            }
    
            if (field.startsWith('videos[')) {
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
                const [_, lectureIndex, videoIndex] : any = match;
                lecturesData[lectureIndex].videos[videoIndex].file = file;
              }
            });
          } else {
            console.error("req.files is not an array. Check your multer configuration.");
          }
    
        // Upload videos to Cloudinary and construct the final data
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
    
        console.log('lectures data ---', )
        processedLectures.map((lecture) => console.log(lecture))

        const createLectureUseCase = new CreateLectureUseCase(
            lectureRepository, 
            courseRepository,
            transactoinManager
         )
        
         const savedLectures:any[] = [];
         for(const lecture of processedLectures){
          const savedLecture = await createLectureUseCase.execute(lecture, courseId);
          savedLectures.push(savedLecture)
         }

         res.status(201).json({success: true, 
            message : 'Lecture created successfully',
            data: savedLectures
         })
    } catch (error) {
        next (error)
    }
}


export const getAllCoursesController = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await getAllCoursesUseCase.execute()
        res.status(200).json({message: 'All courses fetched successfully', success : true, data: courses})
    } catch (error) {
        next(error)
    }
}

