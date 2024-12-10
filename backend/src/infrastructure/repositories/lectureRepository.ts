import mongoose from "mongoose";
import { ILectureRepository } from "../../application/repositories/ILectureRepostitory";
import Lecture, { ILectureDocument } from "../../domain/models/Lecture";

export class LectureRepositoryClass implements ILectureRepository {
  async createLecture(
    data: Partial<ILectureDocument>,
    options: {session?: mongoose.ClientSession}
  ): Promise<ILectureDocument> {
    const lecture = new Lecture(data);
    return await lecture.save();
  }

  async getLectureById(id: string): Promise<ILectureDocument | null> {
    return await Lecture.findById(id);
  }

  async getAllLectures(): Promise<ILectureDocument[] | null> {
    return await Lecture.find({});
  }

  async getLectureByTitle(title: string): Promise<ILectureDocument | null> {
    return await Lecture.findOne({ title });
  }
}
