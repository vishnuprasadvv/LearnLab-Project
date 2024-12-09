export interface ICourses {
    instructor:{
        firstName?: string, 
        lastName?: string,
        profileImageUrl?: string,
        role ?: string
    },
    title:string,
    description?:string,
    imageUrl ?: string,
    imagePublicId ?: string,
    price?: number,
    isPublished? : boolean,
    category ?: {
        name: string,
        _id : string
    },
    level?: string,
    _id: string,
    duration? : number,
    createdAt: Date,
    updatedAt: Date
}