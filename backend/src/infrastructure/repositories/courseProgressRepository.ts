import UserCourseProgress, { IUserCourseProgress } from "../../domain/models/CourseProgress";

export class CourseProgressRepository {
    async getUserCourseProgress (userId: string, courseId: string): Promise<IUserCourseProgress | null>{
        return await UserCourseProgress.findOne({userId, courseId}).exec();
    }

    //create progress for course
    async createProgress(userId: string, courseId: string, lectures:any[]):Promise<IUserCourseProgress> {
        const progressLectures = lectures.map((lecture) => ({
            lectureId: lecture._id,
            completedVideos: lecture.videos.map((video: any) => ({
                videoId : video._id,
                isCompleted: false,
            }))
        }))
        
        const newProgress = new UserCourseProgress({
            userId, 
            courseId,
            completedLectures: progressLectures
        })
        return await newProgress.save();
    }

    //update progress for a video 
    async markVideoComplete(
        userId: string,
        courseId : string, 
        lectureId : string,
        videoId : string,
    ): Promise<IUserCourseProgress | null> {
        const progress = await UserCourseProgress.findOne({userId, courseId});
        if(!progress) return null;

        const lecture = progress.completedLectures.find((l)=> l.lectureId.toString() ===  lectureId)

        if(!lecture) return null;

        const video = lecture.completedVideos.find((v) => v.videoId.toString() === videoId)
        if(video) video.isCompleted = true;

        const totalVideos = progress.completedLectures.reduce(
            (acc, l) => acc + l.completedVideos.length, 0
        )

        const completedVideos = progress.completedLectures.reduce(
            (acc, l) => acc + l.completedVideos.filter((v) => v.isCompleted).length, 0 
        )
        console.log((completedVideos / totalVideos) * 100)
        console.log(lecture)

        progress.progressPercentage = (completedVideos / totalVideos) * 100;
        return await progress.save(); 
    }

    async markCourseIncomplete (userId: string, courseId:string){
        const progress = await UserCourseProgress.findOne({userId, courseId});
        if(!progress) return null;
        progress.completedLectures.forEach((lecture) => {
            lecture.completedVideos.forEach((video) => {
                video.isCompleted = false;
            })
        })
        progress.progressPercentage = 0;
       return await progress.save();
    }

    async markCourseComplete(userId: string, courseId : string) {
        const progress = await UserCourseProgress.findOne({userId, courseId});
        if(!progress) return null;
        progress.completedLectures.forEach((lecture) => {
            lecture.completedVideos.forEach((video) => {
                video.isCompleted = true;
            })
        })
        

        progress.progressPercentage = 100;
        return await progress.save();
    }

}
