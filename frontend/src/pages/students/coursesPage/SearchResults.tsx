import { Badge } from "@/components/ui/badge";
import { ICourses } from "@/types/course";
import { Rating } from "@mui/material";
import { Link } from "react-router-dom";

const SearchResults = ( course :ICourses) => {
  return (
    <Link to={`course-details/${course._id}`} 
    className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-300 dark:border-slate-700 py-4 gap-4 hover:bg-gray-100 dark:hover:bg-slate-700 p-2 hover:rounded-xl">
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

        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-lg md:text-xl">{course.title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{course.category?.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Instructor :<span>{`${course.instructor.firstName} ${course.instructor.lastName}`}</span>
          </p>
          <div className="flex gap-1 items-center">
          <Rating size="small" precision={0.5} value={course.averageRating} readOnly 
          sx={{
            "& .MuiRating-iconEmpty": {
              color: "rgba(128, 128, 128, 1)", // Dark mode and light mode colors
            },
          }}
           />
          <span className="text-xs">({course.ratingsCount})</span>
          </div>
          <Badge className="w-fit md:mt-0 bg-blue-500 text-white dark:bg-blue-700">{course.level}</Badge>
        </div>
      </div>
    </Link>
  );
};

export default SearchResults;
