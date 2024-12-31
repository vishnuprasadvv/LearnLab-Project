import { removeFromWishlistApi } from "@/api/student";
import { Badge } from "@/components/ui/badge";
import { IPopulatedWishlist } from "@/types/wishlist";
import toast from "react-hot-toast";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { Link } from "react-router-dom";

interface IWishlistCourseListProps {
  item : IPopulatedWishlist,
  handleRemoveFromWishlist: (courseId:string) => void;
}
const WishlistCourseList:React.FC<IWishlistCourseListProps> = ({item, handleRemoveFromWishlist}) => {
  const course = item.courseId;

  return (
    <div className="flex w-full items-start border-b border-gray-300 py-4 gap-4 hover:bg-gray-100 p-2 hover:rounded-xl">
     <div className="flex flex-grow justify-between w-full">
        <div className="flex flex-col sm:flex-row gap-4 sm:w-auto w-3/4">
          <img
            src={
              course.imageUrl ||
              "https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp"
            }
            alt="course-thumbnail"
            className="h-32 w-full sm:w-56 object-cover rounded"
          />

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 md:gap-10 lg:gap-28 justify-between w-full">
            <div className="flex flex-col gap-1 bg-green-100 ">
              <Link to={`/courses/course-details/${course._id}`} className="font-bold text-lg md:text-xl hover:text-blue-600 hover:underline">{course.title}</Link>
              <span className="text-xs bg-blue-100 w-max px-2 rounded-full text-blue-600">
                {course.category?.name}
              </span>
              <div className="text-sm text-gray-600">
                <span>Instructor : {course.instructor.name}</span>
              </div>
              <Badge className="w-fit md:mt-0 bg-blue-600 hover:bg-blue-600 cursor-default">
                {course.level}
              </Badge>
            </div>
            <div className="bg-blue-50 flex items-center justify-start sm:justify-center ">
              <span className="font-bold text-blue-500 text-lg">₹ {course.price}</span>
            </div>
          </div>
        </div>
        <div className="flex items-start sm:items-center justify-center">
          <button 
          onClick={() => handleRemoveFromWishlist(course._id)} 
          className=" bg-white p-1 border rounded-md shadow-sm hover:bg-gray-100">
            <IoMdHeart className="text-red-500 text-2xl" />
          </button>
        </div>
    </div>
    
        
    </div>
  );
};

export default WishlistCourseList;
