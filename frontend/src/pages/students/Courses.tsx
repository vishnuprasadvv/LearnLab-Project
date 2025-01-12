import { getTopRatedCoursesApi } from "@/api/student";
import Course from "@/components/common/Course/Course";
import CourseSkeleton from "@/components/common/courseSkeleton/CourseSkeleton";
import { ICourses } from "@/types/course";
import { useEffect, useState } from "react";


const Courses = () => {
const isLoading = false;
    const [courses, setCourses] = useState<ICourses[] | []>([]);
    const [displayedCourses, setDisplyedCourses] = useState<ICourses[] | []>([]);
    const limit = 8;
  
    useEffect(() => {
      const getAllCourses = async () => {
        try {
          const response = await getTopRatedCoursesApi(limit);
          setCourses(response.data)
          setDisplyedCourses(response.data.slice(0, limit))
        } catch (error) {
          console.error("error fetching courses", error);
        }
      };
      getAllCourses();
    }, []);


  return (
    <div className="bg-gray-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto p-6 ">
        <h1 className="font-bold text-3xl text-center mb-10">Top Rated Courses</h1>

        {!courses || !courses.length && (
          <div className="text-center">
            <h1 className="text-lg font-semibold text-slate-600">No courses available</h1>
            </div>
        )}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : displayedCourses.map((course, index) => <Course key={index} {...course}/>)}
        </div>
      </div>
    </div>
  );
};

export default Courses;
