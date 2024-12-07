import { ICategoryRepository } from "../../application/repositories/ICategoryRepository";
import CourseCategory, { ICategory } from "../../domain/models/CourseCategories";

export class CategoryRespository implements ICategoryRepository{
    async createCategory(data: Partial<ICategory>): Promise<ICategory>{
        const category = new CourseCategory(data);
        return await category.save()
    }

    async getAllCategoriesAtOnce():Promise<ICategory[]> {
        const allCategories = CourseCategory.find({ isDeleted: false}).sort({name: 1})
        return allCategories;
    }

    async getAllCategories(page:number , limit: number, query: string) {
        const skip = (page -1) * limit;
        //search query 
        const searchQuery = query ? {isDeleted: false, name: {$regex: query , $options: "i"}} : {isDeleted: false};

        const categories = await CourseCategory.find(searchQuery).populate('parentCategoryId').sort({createdAt : -1}).skip(skip).limit(limit)

        const totalCount = await CourseCategory.countDocuments(searchQuery)
        return {categories, totalPages: Math.ceil (totalCount / limit), currentPage : page}
    }

    async updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
        return await CourseCategory.findByIdAndUpdate(id, data, {new : true})
    }
    async getCategoryByName(name: string) : Promise<ICategory | null> {
        return await CourseCategory.findOne({name})
    }

    async getCategoryById(id: string): Promise<ICategory | null> {
        return await CourseCategory.findById(id)
    }
}