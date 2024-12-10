import mongoose from "mongoose"
import { ILectureDocument } from "../../domain/models/Lecture"

export interface ILectureRepository {

    createLecture(data: Partial<ILectureDocument> ,options: {session?: mongoose.ClientSession}) : Promise<ILectureDocument>

    getAllLectures() : Promise<ILectureDocument[] | null>

    getLectureById(id: string) : Promise<ILectureDocument | null>

    getLectureByTitle(title: string) : Promise<ILectureDocument | null>
}