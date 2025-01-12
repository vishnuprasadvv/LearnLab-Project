import { NextFunction, Request, Response } from "express"
import { actionInstructorApplication, getInstructorApplication, getInstructors } from "../../../../application/use-cases/admin/instructorManagement"

export const getInstructorsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instructors = await getInstructors()

        res.status(200).json({success: true, instructors})
    } catch (error) {
        console.error('getinstructor error,', error)
        next(error)
    }
}

export const getInstructorApplicationHandler = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
    try {
        const application = await getInstructorApplication(id)
        res.status(200).json({success: true, application})
    } catch (error) {
        console.error('getinstructor error,', error)
        next(error)
    }
}

export const acceptInstructorApplicationHandler = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
    try {
        const application = await actionInstructorApplication(id, 'approved')
        res.status(200).json({success: true, application, message: 'Instructor application accepted'})
    } catch (error) {
        console.error('acceptinstructorApplication error,', error)
        next(error)
    }
}

export const rejectInstructorApplicationHandler = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
    try {
        const application = await actionInstructorApplication(id, 'rejected')
        res.status(200).json({success: true, application, message: 'Instructor application rejected'})
    } catch (error) {
        console.error('acceptinstructorApplication error,', error)
        next(error)
    }
}

