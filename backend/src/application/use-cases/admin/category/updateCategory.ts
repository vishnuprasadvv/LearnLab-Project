import { ICategory } from "../../../../domain/models/CourseCategories";
import { CustomError } from "../../../../interfaces/middlewares/errorMiddleWare";
import { ICategoryRepository } from "../../../repositories/ICategoryRepository";

export class UpdateCategoryUseCase {
    constructor(private categoryRepository: ICategoryRepository) {}

    async execute (id: string, data: Partial<ICategory>) : Promise<ICategory | null>{
       if(!id){
        throw new CustomError('category id is required', 400)
       }
       // Check if the course exists
    const category = await this.categoryRepository.getCategoryById(id);
    if (!category) {
      throw new CustomError("Category not found", 404);
    }
        if(data.name){
            const existsCategory = await this.categoryRepository.getCategoryByName(data.name)
            if(existsCategory && existsCategory._id === category._id){
                throw new CustomError('Category with same name is already exist', 400)
            }
        }
        const updatedCategory = await this.categoryRepository.updateCategory(id, data)
        if(!updatedCategory){
            throw new CustomError('Failed to update category details',400)
        }
        return updatedCategory
    } 
}