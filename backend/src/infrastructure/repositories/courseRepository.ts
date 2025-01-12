import Courses, { ICourses } from "../../domain/models/Courses";
import { ICoursePopulated, ICourseRepository } from "../../application/repositories/ICourseRepository";
import { SortOrder } from "mongoose";

interface Pagination {
  page: number,
  limit: number
}

interface Filter {
  [key : string] : any
}

interface PaginatedResultCourses {
  courses: ICourses[];
  totalCourses: number;
  totalPages : number | null;
}

export class CourseRepositoryClass implements ICourseRepository{

  //for instructors

    async createCourse(data: Partial<ICourses>): Promise<ICourses>{
        const category = new Courses(data);
        return await category.save()
    }

   async getCourseById(id: string) : Promise<ICourses | null>{
        return await Courses.findOne({_id:id, isDeleted: false}).populate([
            { path: 'category'},
            {path : 'instructor', select:'-password -phone -profileImagePublicId'}
        ]
        )
   }
   async findById(id:string):Promise<ICourses | null> {
    return await Courses.findById(id)
   }

   async getCourseByIds(ids: string[]) : Promise<ICourses[] | null>{
    if (!Array.isArray(ids) || ids.length === 0) {
      console.error("Invalid or empty IDs array provided.");
      return null;
    }
        return await Courses.find({_id:{ $in: ids }, isDeleted: false}).populate([
            { path: 'category'},
            {path : 'instructor', select:'-password -phone -profileImagePublicId'}
        ]
        )
   }

   async getAllCourses(instructorId: string) : Promise<ICourses[] | null>{
        return await Courses.find({instructor: instructorId ,isDeleted: false}).populate([
            { path: 'instructor', select: '-password -phone -profileImagePublicId' },
            {path: 'category', select: 'name _id'}
        ])
        .sort({createdAt: -1})
   }


   async getCourseByName(title: string) : Promise<ICourses | null> {
    return await Courses.findOne({title, isDeleted: false})
}

// Add lectures to the course
async addLectures(courseId: string, lectures: any[]): Promise<ICourses | null> {
    return await Courses.findOneAndUpdate(
      {_id: courseId, isDeleted: false},
      { $push: { lectures: lectures  } },
      { new: true }
    );
  }

  async deleteCourse(courseId: string): Promise<ICourses | null> {
      return await Courses.findByIdAndUpdate(courseId, {isDeleted: true}, {new: true})
  }
    
  async updateCourse(courseId: string, updateData: Partial<ICourses>): Promise<ICourses | null> {
    return await Courses.findOneAndUpdate({_id: courseId, isDeleted: false}, updateData, {new : true})
  }
    

  // Update lectures to the course
async updateLecture(courseId: string, udpatedLectureData: any[]): Promise<ICourses | null> {
  const course = await Courses.findOne({_id: courseId, isDeleted: false});
  if(!course){
    throw new Error('Course not found')
  }
  const updatedLectures =  [];
  for(let newData of udpatedLectureData){
    updatedLectures.push(newData)
  }


  const updatedLecture =  await Courses.findOneAndUpdate(
    {_id: courseId, isDeleted: false},
    { $set: { lectures : updatedLectures  } },
    { new: true }
  );
  if(!updatedLecture) throw new Error('Lecture update failed')
  return updatedLecture;
}

async publishCourse(courseId: string, publishValue : boolean): Promise<ICourses | null> {
  return await Courses.findOneAndUpdate({_id : courseId, isDeleted: false}, 
    {$set: {isPublished: publishValue}}, 
    { new: true})
}

//for users 

async getAllCoursesUsers(): Promise<ICourses[] | null> {
  return await Courses.find({isDeleted: false, isPublished: true}).populate([
    {path: 'instructor', select: '-password -profileImagePublicId'},
    {path: 'category', select: 'name _id'}
  ]).sort({createdAt: -1}).select('-lectures.videos.url -lectures.videos.publicId')
}

//filtered course for users (search, filter, sort)

async getAllFilteredCoursesUsers(filter : Filter, sort:Record<string, SortOrder>, pagination : Pagination): Promise<PaginatedResultCourses> {
  const query = Courses.find({...filter, isPublished: true, isDeleted : false}).populate([
    {path: 'instructor', select: '-password -profileImagePublicId '},
    {path: 'category', select: 'name _id'}
  ]).select('-lectures.videos.url -lectures.videos.publicId')

  if(sort){
    query.sort(sort).collation({ locale: 'en', strength: 2 })
  }

  if(pagination){
    const skip = (pagination.page - 1) * pagination.limit;
    query.skip(skip).limit(pagination.limit)
  }

  const courses = await query.exec();
  const totalCourses = await Courses.countDocuments({...filter, isPublished: true, isDeleted: false});
  const totalPages = pagination ? Math.ceil(totalCourses / pagination.limit) : null;

  return {
    courses, 
    totalCourses,
    totalPages
  }
}

async getCourseByIdUser(id: string) : Promise<ICourses | null>{
  return await Courses.findOne({_id:id, isDeleted: false}).populate([
      { path: 'category'},
      {path : 'instructor', select:'-password -phone -profileImagePublicId'}
  ]
  ).select('-lectures.videos.url -lectures.videos.publicId')
}

async getCourseByIdsUser(ids: string[]) : Promise<ICourses[] | null>{
  if (!Array.isArray(ids) || ids.length === 0) {
    console.error("Invalid or empty IDs array provided.");
    return null;
  }
      return await Courses.find({_id:{ $in: ids }, isDeleted: false}).populate([
          { path: 'category'},
          {path : 'instructor', select:'-password -phone -profileImagePublicId'}
      ]
      ).select('-lectures.videos.url -lectures.videos.publicId')
 }

async getAllCoursesAdmin(filter:Filter, sort: Record<string, SortOrder>, pagination: Pagination):Promise<PaginatedResultCourses> {

  const query = Courses.find({...filter, isDeleted:false}).populate([
    {path: 'instructor', select: '-password -profileImagePublicId'},
    {path: 'category', select: 'name _id'}
  ])

  if(sort){
    query.sort(sort).collation({ locale: 'en', strength: 2 })
  }

  if(pagination){
    const skip = (pagination.page - 1) * pagination.limit;
    query.skip(skip).limit(pagination.limit)
  }

  const courses = await query.exec();

  const totalCourses = await Courses.countDocuments({...filter, isDeleted: false});
  const totalPages = pagination ? Math.ceil(totalCourses / pagination.limit) : null;

  return {
    courses, 
    totalCourses,
    totalPages
  }
}

//increment enrolledcount
async incrementEnrolledCount(courseId: string, incrementBy = 1): Promise<void> {
  await Courses.findByIdAndUpdate(
    courseId,
    {$inc: {enrolledCount: incrementBy}},
    {new : true}
  )
}

  async getVideoPublicUrl(courseId: string, videoId: string): Promise<string | null> {
    const course = await Courses.findOne({
      _id: courseId,
      'lectures.videos._id': videoId,
    }).select('lectures.videos.$');

    if(!course || !course.lectures) return null;
    const video = course.lectures[0].videos.find((vid) => vid._id?.toString() === videoId)
    return video ? video.publicId : null;
  }

  async updateRating(course: ICourses ):Promise<void> {
    await Courses.findByIdAndUpdate(course._id, {
      averageRating:course.averageRating,
      ratingsCount : course.ratingsCount,
    })
  }

  //admin dashboard
  async countAll(): Promise<number> {
    return await Courses.countDocuments();
  }

  async countPublished(): Promise<number> {
    return await Courses.countDocuments({isPublished:true, isDeleted: false})
  }

  async getBestSellingCourses(limit: number = 10):Promise<ICourses[]> {
    return await Courses.find({ isDeleted : false, isPublished : true, enrolledCount: {$gt: 0}})
      .sort({enrolledCount: -1})
      .limit(limit)
      .exec()
  }

  async getTopRatedCoursesUser(limit:number): Promise<ICourses[]>{
    return await Courses.find({isDeleted: false, isPublished : true},{'lectures.videos': 0})
      .sort({averageRating : -1})
      .limit(limit).populate('instructor','firstName lastName profileImageUrl ')
  }
  

}