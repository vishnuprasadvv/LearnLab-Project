import { NextFunction, Request, Response } from "express";
import { CreateUserUseCaseAdmin, DeleteUserUseCaseAdmin, EditUserUseCaseAdmin, GetAllUsersUseCaseAdminWithFilter, ToggleUserStatusUseCase } from "../../../../application/use-cases/admin/userManagement";
import { UserRepositoryImpl } from "../../../../infrastructure/repositories/userRepositoryImpl";

const userRepository = new UserRepositoryImpl()

export const getAllUsersController = async (req: Request, res: Response) => {
        const {search, page = '1', limit = '10' } = req.query;

    try {
        const searchQuery = typeof search === 'string' ? search : '';
        // Parse page and limit to numbers
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const useCase = new GetAllUsersUseCaseAdminWithFilter(userRepository)
        const {users, total} = await useCase.execute({search:searchQuery, page:pageNum, limit:limitNum})
        res.status(200).json({users, total})
    } catch (error) {
        console.error('getuser error', error)
        res.status(400).json({ message: 'Error fetching data' })
    }
}

export const deleteUserController = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const useCase = new DeleteUserUseCaseAdmin(userRepository)
        const deletedUser = await useCase.execute(userId)
        res.status(200).json({ success: true, deletedUser })
    } catch (error) {
        res.status(400).json({ message: 'Error deleting user data' })
    }
}

export const createUserController = async (req: Request, res: Response, next : NextFunction) => {
    const { firstName, lastName, email, phone, password, role, userStatus } = req.body;
    try {
        const useCase = new CreateUserUseCaseAdmin(userRepository)
        const user = await useCase.execute(firstName, lastName, email, phone, password, role,userStatus)
        res.status(200).json({ success: true, message: 'User created successfully' })
    } catch (error) {
        next(error)
    }
}

export const getEditUserController = async (req: Request, res: Response, next : NextFunction) => {
    const {id} = req.params
    
    try {
        const user = await userRepository.findById(id)
        res.status(200).json({ success: true, user })
    } catch (error) {
        next(error)
    }
}

export const postEditUserController = async (req: Request, res: Response, next : NextFunction) => {
    const {id} = req.params;
    const { firstName, lastName, email, phone, password, role, userStatus } = req.body;
    try {
        const useCase = new EditUserUseCaseAdmin(userRepository)
        const user = await useCase.execute(id, firstName, lastName, email, phone, role, userStatus)
        res.status(200).json({ success: true, message: 'User edited successfully' })
    } catch (error) {
        next(error)
    }
}

export const toggleStatusController = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const {status} = req.body;
    try {
        const useCase = new ToggleUserStatusUseCase(userRepository)
        const user = await useCase.execute(id, status)
        res.status(200).json({success: true, message: 'User status updated', user})
    } catch (error) {
        next(error)
    }
}
