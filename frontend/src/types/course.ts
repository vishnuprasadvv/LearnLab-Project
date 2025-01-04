export interface IVideo {
    title: string;
    url: string;
    publicId: string;
    duration: number;
    isFree: boolean;
    _id: string;
    
}

export interface ILectureDocument extends Document{
    title: string,
    description: string,
    videos: IVideo[];
    order : number;
    createdAt: Date;
    updatedAt: Date;
    isFree: boolean;
    _id: string;
}

export interface ICourses {
    instructor:{
        _id: string;
        firstName?: string, 
        lastName?: string,
        profileImageUrl?: string,
        role ?: string
    },
    title:string,
    description:string,
    imageUrl ?: string,
    imagePublicId ?: string,
    price: number,
    isPublished? : boolean,
    category ?: {
        name: string,
        _id : string
    },
    level?: string,
    _id: string,
    duration? : number,
    createdAt: Date,
    updatedAt: Date,
    lectures?: ILectureDocument[] | [],
    rating ?: number,
    enrolledCount: number,
    averageRating:number,
    ratingsCount: number
}