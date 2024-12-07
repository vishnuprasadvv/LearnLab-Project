import { ICategory } from "../../../../domain/models/CourseCategories";
import { CustomError } from "../../../../interfaces/middlewares/errorMiddleWare";
import { ICategoryRepository } from "../../../repositories/ICategoryRepository";

export class GetCategoriesUseCase {
    constructor(private categoryRepository: ICategoryRepository) {}
  
    async execute( page: number , limit: number, query: string): Promise<{categories: ICategory[], totalPages:number, currentPage: number }> {

      if(page <= 0 || limit <=0){
        throw new CustomError('Page and limit must be greater than zero',400)
      }
      const categories = await this.categoryRepository.getAllCategories(page, limit, query);
      if (!categories) {
        throw new CustomError('Failed to fetch categories',400);
      }
      return categories;
    }
  }



  