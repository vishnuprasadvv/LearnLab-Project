import { ICategory } from "../../domain/models/CourseCategories";


export interface ICategoryRepository{
    createCategory (data: Partial<ICategory>) : Promise<ICategory>;

    getAllCategoriesAtOnce() : Promise<ICategory[]>;
    getAllCategories(page: number, limit: number, query: string) : Promise<{categories: ICategory[], totalPages:number, currentPage: number }>;

    //update an existing category by its id

    updateCategory(id: string, data : Partial<ICategory>): Promise <ICategory | null>;

    getCategoryByName(name:string) : Promise<ICategory | null>

    getCategoryById(id: string) : Promise<ICategory | null>
}