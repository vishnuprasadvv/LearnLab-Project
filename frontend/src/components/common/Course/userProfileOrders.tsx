import { Badge } from "@/components/ui/badge";
import { ICoursesInOrder } from "@/types/orders";
import { Link } from "react-router-dom";


const UserProfileCourses = (course:ICoursesInOrder) => {
  return (
    <Link to={`/courses/course-details/${course.courseId}`} 
    className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-300 py-4 gap-4 dark:hover:bg-slate-700 hover:bg-gray-100 p-2 hover:rounded-xl">
      <div
        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
      >
        <img
          src={ course.courseImage ||
            "https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp"
          }
          alt="course-thumbnail"
          className="h-32 w-full sm:w-56 object-cover rounded"
        />

        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-lg md:text-xl">{course.courseTitle}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{course.courseCategory}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Instructor :<span>{`${course.courseInstructor}`}</span>
          </p>
          <Badge className="w-fit mt-2 md:mt-0">{course.courseLevel || 'level'}</Badge>
        </div>
      </div>
    </Link>
  );
};

export default UserProfileCourses;
