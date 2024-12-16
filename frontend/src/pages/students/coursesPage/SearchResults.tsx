import { Badge } from "@/components/ui/badge";
import { ICourses } from "@/types/course";
import { Link } from "react-router-dom";

const SearchResults = ( course :ICourses) => {
  return (
    <Link to={`course-details/${course._id}`} 
    className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-300 py-4 gap-4 hover:bg-gray-100 p-2 hover:rounded-xl">
      <div
        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto "
      >
        <img
          src={ course.imageUrl ||
            "https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp"
          }
          alt="course-thumbnail"
          className="h-32 w-full sm:w-56 object-cover rounded"
        />

        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-lg md:text-xl">{course.title}</h1>
          <p className="text-sm text-gray-600">{course.category?.name}</p>
          <p className="text-sm text-gray-600">
            Instructor :<span>{`${course.instructor.firstName} ${course.instructor.lastName}`}</span>
          </p>
          <Badge className="w-fit mt-2 md:mt-0">{course.level}</Badge>
        </div>
      </div>
    </Link>
  );
};

export default SearchResults;
