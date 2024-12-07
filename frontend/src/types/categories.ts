export interface Category {
    name:string,
    description: string, 
    isActive: boolean
    parentCategoryId?:string,
    _id: string
}