import { Request, Response } from "express";
import { deleteUser, getAllUsers } from "../../application/use-cases/admin/userManagement";

export const getAllUsersController = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers()
        res.status(200).json(users)
    } catch (error) {
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