interface ICourseDetailsWishlist {
    _id: string ;
    title: string;
    description: string;
    price: number;
    instructor: {
      name: string,
      _id:string,
    }
    imageUrl ?: string,
    category ?: {
      _id:string,
      name:string
    },
    level? : string;
    averageRating: number;
    ratingsCount: number
  }
  export interface IPopulatedWishlist {
      courseId: ICourseDetailsWishlist; 
      addedAt: Date;
    };