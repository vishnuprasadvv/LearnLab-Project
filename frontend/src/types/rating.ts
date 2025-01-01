export interface ICourseRating {
    courseId: string;
    userId: {
        _id: string,
        firstName : string,
        lastName : string,
        role : string,
        profileImageUrl : string
    }
    rating: number;
    review?: string;
    _id? : string ;
    createdAt : Date;
    updatedAt : Date;
}