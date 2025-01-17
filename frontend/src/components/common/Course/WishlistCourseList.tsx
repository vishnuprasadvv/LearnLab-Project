import { Badge } from "@/components/ui/badge";
import { IPopulatedWishlist } from "@/types/wishlist";
import { Rating } from "@mui/material";
import { IoMdHeart,  } from "react-icons/io";
import { Link } from "react-router-dom";

interface IWishlistCourseListProps {
  item : IPopulatedWishlist,
  handleRemoveFromWishlist: (courseId:string) => void;
}
const WishlistCourseList:React.FC<IWishlistCourseListProps> = ({item, handleRemoveFromWishlist}) => {
  const course = item.courseId;
  return (
    <div className="flex w-full items-start border-b border-gray-300 dark:border-slate-700 py-4 gap-4 hover:bg-gray-100 dark:hover:bg-slate-800 p-2 hover:rounded-xl">
     <div className="flex flex-grow justify-between w-full">
        <div className="flex flex-col sm:flex-row gap-4 md:w-3/4 w-full">
          <img
            src={
              course.imageUrl ||
              "https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp"
            }
            alt="course-thumbnail"
            className="h-auto w-full sm:w-52 sm:h-32 object-cover rounded"
          />

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 md:gap-10 lg:gap-28 justify-between w-full">
            <div className="flex flex-col gap-1 w-2/3">
              <Link to={`/courses/course-details/${course._id}`} className="font-bold text-lg md:text-xl hover:text-blue-600 hover:underline">{course.title}</Link>
              <span className="text-xs bg-blue-100 dark:bg-blue-700 dark:text-gray-100 w-max px-2 rounded-full text-blue-600">
                {course.category?.name}
              </span>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span>Instructor : {course.instructor.name}</span>
              </div>
              <div className="flex gap-1 items-center">
          <Rating size="small" precision={0.5} value={course.averageRating || 0} 
          sx={{
            "& .MuiRating-iconEmpty": {
              color: "rgba(128, 128, 128, 1)", // Dark mode and light mode colors
            },
          }}
          />
          <span className="text-xs">({course.ratingsCount || 0})</span>
          </div>
              <Badge className="w-fit md:mt-0 bg-blue-600 hover:bg-blue-600 cursor-default">
                {course.level}
              </Badge>
            </div>
            <div className="w-1/3 flex items-center justify-start sm:justify-center ">
              <span className="font-bold text-blue-500 text-lg">₹ {course.price}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end sm:w-auto w-1/3">
          <button 
          onClick={() => handleRemoveFromWishlist(course._id)} 
          className=" bg-white p-1 border rounded-md shadow-sm hover:scale-105 duration-300 transition-all hover:bg-slate-400 text-red-500 hover:text-white">
            <IoMdHeart className=" text-3xl sm:text-2xl" />
          </button>
        </div>
    </div>
    
        
    </div>
  );
};

export default WishlistCourseList;
