import { NextFunction, Request, Response } from "express";
import { CategoryRespository } from "../../../../infrastructure/repositories/categoryRepository";
import { GetCategoriesUseCase } from "../../../../application/use-cases/admin/category/getCategory";
import { CreateCategoryUseCase } from "../../../../application/use-cases/admin/category/createCategory";
import { UpdateCategoryUseCase } from "../../../../application/use-cases/admin/category/updateCategory";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { GetAllCategoriesAtOnceUseCase } from "../../../../application/use-cases/admin/category/getAllCategoriesAtOnce";




const categoryRepository = new CategoryRespository();
const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository)
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository)
const getAllCategoriesAtOnce = new GetAllCategoriesAtOnceUseCase(categoryRepository)

export const getCategories = async (req: Request, res: Response, next:NextFunction) => {
    try{
        const {page = 1, limit = 10, query = ''} = req.query;
        const response = await getCategoriesUseCase.execute(Number(page), Number(limit), String(query));
        res.status(200).json({data: response, success: true, message: 'Fetch courses success'});
    }catch(error){
        next(error)
    }
}
//getallcategories list
export const getAllCategoriesAtOnceController = async (req: Request, res: Response, next:NextFunction) => {
    try{
        const categories = await getAllCategoriesAtOnce.execute()
        res.status(200).json({categories, success: true, message: 'Fetch courses success'});
    }catch(error){
        next(error)
    }
}


export const createCategoryController = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {name, description, parentCategoryId, isActive} = req.body;
        if (Object.keys({name, description, parentCategoryId, isActive}).length === 0) {
            throw new CustomError("No input provided for update", 400);
          }
        const createdCategory = await createCategoryUseCase.execute({name, description, parentCategoryId, isActive})
        res.status(200).json({createdCategory, message : 'Category created successfully', success: true})
    } catch (error) {
        next(error)
    }
}

export const updateCategoryController = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const categoryData = req.body;
        if (Object.keys(categoryData).length === 0) {
            throw new CustomError("No input provided for update", 400);
          }
        
        const updatedCategory = await updateCategoryUseCase.execute(id, categoryData)
        if(!updateCategoryController){
            throw new CustomError('Category not found', 404)
        }
        res.status(200).json({data: updatedCategory, message: 'Category updated successfully', success : true})
    } catch (error) {
        next(error)
    }
}