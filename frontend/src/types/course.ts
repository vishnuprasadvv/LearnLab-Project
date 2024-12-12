export interface IVideo {
    title: string;
    url: string;
    publicId: string;
    duration: number;
    isFree: boolean;
    
}

export interface ILectureDocument extends Document{
    title: string,
    description: string,
    videos: IVideo[];
    order : number;
    createdAt: Date;
    updatedAt: Date;
    isFree: boolean;
}

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
    updatedAt: Date,
    lectures?: ILectureDocument[] | []
}