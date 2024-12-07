import { ICategory } from "../../../../domain/models/CourseCategories";
import { CustomError } from "../../../../interfaces/middlewares/errorMiddleWare";
import { ICategoryRepository } from "../../../repositories/ICategoryRepository";

export class GetAllCategoriesAtOnceUseCase {
    constructor(private categoryRepository: ICategoryRepository) {}
  
    async execute( ): Promise<ICategory[]> {

      const categories = await this.categoryRepository.getAllCategoriesAtOnce();
      if (!categories) {
        throw new CustomError('Failed to fetch categories',400);
      }
      return categories;
    }
  }



  