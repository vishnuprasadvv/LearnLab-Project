import { getAllCoursesUserApi } from "@/api/student";
import Course from "@/components/common/Course/Course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Filter from "@/components/user/course/Filter";
import { ICourses } from "@/types/course";
import React, { useEffect, useState } from "react";
import SearchResults from "./SearchResults";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const CoursesPage = () => {
  const isLoading = false;
  const [courses, setCourses] = useState<ICourses[] | []>([]);

  useEffect(() => {
    const getAllCourses = async () => {
      try {
        const response = await getAllCoursesUserApi();
        console.log(response);
        setCourses(response.data);
      } catch (error) {
        console.error("error fetching courses", error);
      }
    };
    getAllCourses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="my-6">
      <form action="" className='flex items-center  dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6'>
          <Input type='text' className='focus-visible:ring-0 bg-white rounded-r-none rounded-l-full text-gray-900 dark:gray-800'/> 
          <Button className='bg-blue-600 dark:bg-blue-700 text-white px-6 py-4 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800'>Search</Button>
        </form>
        <h1>result for 'search'</h1>
        <p>
          Showing results for{" "}
          <span className="text-blue-600 italic">Frontend develper</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        {/* Filter page  */}
        <Filter />
        <div className="flex-1">
          
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeletonLine key={index} />
              ))
            ) : !courses.length ? (
              <CourseNotFound />
            ) : (
              courses.map((course, index) => (
                <SearchResults key={index} {...course} />
              ))
            )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;

const CourseNotFound = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-32 dark:bg-gray-900 p-6">
        <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
        <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
          Course Not Found
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          Sorry, we couldn't find the course you're looking for.
        </p>
        <Link to="/" className="italic">
          <Button variant="link">Browse All Courses</Button>
        </Link>
      </div>
    );
  };
  
  const CourseSkeletonLine = () => {
    return (
      <div className="flex-1 flex flex-col md:flex-row justify-between border-b border-gray-300 py-4">
        <div className="h-32 w-full md:w-64">
          <Skeleton className="h-full w-full object-cover" />
        </div>
  
        <div className="flex flex-col gap-2 flex-1 px-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="h-6 w-20 mt-2" />
        </div>
  
        <div className="flex flex-col items-end justify-between mt-4 md:mt-0">
          <Skeleton className="h-6 w-12" />
        </div>
      </div>
    );
  };
