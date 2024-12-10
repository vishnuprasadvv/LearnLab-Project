
import { ILectureDocument } from "../../../../domain/models/Lecture";
import { CustomError } from "../../../../interfaces/middlewares/errorMiddleWare";
import { ICourseRepository } from "../../../repositories/ICourseRepository";
import { ILectureRepository } from "../../../repositories/ILectureRepostitory";
import { ITransactionManager } from "../../../repositories/ITransactions";


export class CreateLectureUseCase {
    constructor(private lectureRepository : ILectureRepository, 
        private courseRepository : ICourseRepository,
        private transactionManager : ITransactionManager
    ){
    }

    async execute(data: Partial<ILectureDocument>,courseId: any ):Promise<ILectureDocument>{
        const transaction = await this.transactionManager.startTransaction()
        try {
            const createdLecture = await this.lectureRepository.createLecture({...data, course: courseId},{session : transaction.getSession()})
            if(!createdLecture) {
                throw new CustomError('Lecture creation failed', 400)
            }
            console.log('new lecture created')
        await this.courseRepository.addLectureToCourse(courseId, createdLecture._id, {session: transaction.getSession()})
        console.log('lecture id added to course')
        await transaction.commit()
        return createdLecture;
        } catch (error) {
            await transaction.rollback()
            throw error;
        }
        
    }
}