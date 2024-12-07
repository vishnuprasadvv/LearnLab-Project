import { ICategory } from "../../../../domain/models/CourseCategories";
import { CustomError } from "../../../../interfaces/middlewares/errorMiddleWare";
import { ICategoryRepository } from "../../../repositories/ICategoryRepository";

export class CreateCategoryUseCase {
    constructor(private categoryRepository: ICategoryRepository){}

    async execute (data: Partial<ICategory>): Promise<ICategory> {
        if(!data.name){
            throw new CustomError('Name field required', 400)
        }

        const existingCategory = await this.categoryRepository.getCategoryByName(data?.name)
        if(existingCategory){
            throw new CustomError('Category with this name already exists', 400)
        }
        const newCategory =  await this.categoryRepository.createCategory(data)

        if(!newCategory) {
            throw new CustomError("Category creation failed", 400)
        }
        return newCategory
    }
}