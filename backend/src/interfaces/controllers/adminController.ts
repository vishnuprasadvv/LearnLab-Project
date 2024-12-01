import { NextFunction, Request, Response } from "express";
import { createUser, deleteUser, getAllUsers, getEditUser, postEditUser, toggleUser } from "../../application/use-cases/admin/userManagement";

export const getAllUsersController = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers()
        res.status(200).json(users)
    } catch (error) {
        console.log('getuser error', error)
        res.status(400).json({ message: 'Error fetching data' })
    }

}

export const deleteUserController = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const deletedUser = await deleteUser(userId)
        res.status(200).json({ success: true, deletedUser })
    } catch (error) {
        res.status(400).json({ message: 'Error deleting user data' })
    }
}
export const createUserController = async (req: Request, res: Response, next : NextFunction) => {
    const { firstName, lastName, email, phone, password, role, userStatus } = req.body;
    try {
        const user = await createUser(firstName, lastName, email, phone, password, role,userStatus)
        res.status(200).json({ success: true, message: 'User created successfully' })
    } catch (error) {
        // res.status(400).json({success:false,  message: error })
        next(error)
    }
}

export const getEditUserController = async (req: Request, res: Response, next : NextFunction) => {
    const {id} = req.params
    
    try {
        const user = await getEditUser(id)
        res.status(200).json({ success: true, user })
    } catch (error) {
        next(error)
    }
}

export const postEditUserController = async (req: Request, res: Response, next : NextFunction) => {
    const {id} = req.params;
    const { firstName, lastName, email, phone, password, role, userStatus } = req.body;
    try {
        const user = await postEditUser(id, firstName, lastName, email, phone, password, role,userStatus)
        res.status(200).json({ success: true, message: 'User edited successfully' })
    } catch (error) {
        // res.status(400).json({success:false,  message: error })
        next(error)
    }
}

export const toggleStatusController = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const {status} = req.body;
    try {
        const user = await toggleUser(id, status)
        res.status(200).json({success: true, message: 'User status updated', user})
    } catch (error) {
        next(error)
    }
}