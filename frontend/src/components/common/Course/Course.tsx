import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ICourses } from "@/types/course";
import Rating from '@mui/material/Rating'
import { Link } from "react-router-dom";

const Course = (course:ICourses) => {
  return (
    <Link to={`/courses/course-details/${course._id}`}>
    <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="relative ">
            <img src={course.imageUrl || "https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp"}
            className="w-full h-44 object-cover rounded-t-lg"
            alt="course"/>
            
        </div>
        <CardContent className="mt-2 px-5 py-3 space-y-2">
            <h1 className="hover:underline font-semibold text-lg truncate">{course.title}</h1>
            <div className="text-xs flex items-center text-gray-500">
            <Rating size="small" defaultValue={2.5} precision={0.5} readOnly/>
            <span>(10)</span>
            </div>
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar className="bg-gray-200 h-8 w-8">
                    <AvatarImage src={course.instructor?.profileImageUrl ? course.instructor.profileImageUrl : "https://png.pngtree.com/png-vector/20230903/ourmid/pngtree-man-avatar-isolated-png-image_9935819.png"} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h2 className=" text-xs font-medium text-gray-500" >{`${course.instructor.firstName} ${course.instructor.lastName}`}</h2>
            </div>
                <Badge className="bg-blue-500 text-white px-1 py-1 text-xs hover:bg-blue-500">
                    {course.level}
                    </Badge>
            </div>
            <div>
                <span className="font-bold text-slate-800">₹ {course.price}</span>
            </div>
           
        </CardContent>
    </Card>
    </Link>
  );
};

export default Course;
