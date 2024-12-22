import mongoose, { Document, Schema, ObjectId } from "mongoose";

export interface IProgressVideo {
  videoId: string | ObjectId;
  isCompleted: boolean;
}

export interface iProgressLecture {
  lectureId: string | ObjectId;
  completedVideos: IProgressVideo[];
}

export interface IUserCourseProgress extends Document {
  userId: string | ObjectId;
  courseId: string | ObjectId;
  completedLectures: iProgressLecture[];
  progressPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressVideoSchema = new Schema<IProgressVideo>({
  videoId: { type: Schema.Types.ObjectId, ref: "Video", required: true },
  isCompleted: { type: Boolean, default: false },
});

const ProgressLectureSchema = new Schema<iProgressLecture>({
  lectureId: { type: Schema.Types.ObjectId, ref: "Lecture", required: true },
  completedVideos: { type: [ProgressVideoSchema], default: [] },
});

const UserCourseProgressSchema = new Schema<IUserCourseProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    completedLectures: { type: [ProgressLectureSchema], default: [] },
    progressPercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const UserCourseProgress = mongoose.model<IUserCourseProgress>(
  "UserCourseProgress",
  UserCourseProgressSchema
);

export default UserCourseProgress;
