import { getBestSellingCoursesApi } from "@/api/adminApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BEST_SELLING_COURSES_LIMIT_ADMIN } from "@/config/paginationConifig";
import { ICourses } from "@/types/course";
import React, { useEffect, useState } from "react";

const TopSellingCourses: React.FC = () => {

    const limit = BEST_SELLING_COURSES_LIMIT_ADMIN || 10
    const [bestCourses , setBestCourses] = useState<ICourses[]>([])
      useEffect(() => {
        const getTopCourses = async() => {
            try {
                const response = await getBestSellingCoursesApi(limit)
                setBestCourses(response.data)
            } catch (error) {
                console.error('fetching top courses error', error)
            }
        }
        getTopCourses()
      }, [])


if(bestCourses.length == 0){
  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Best Selling Courses
      </h2>
      <h1 className="text-xl font-bold text-gray-500 dark:text-gray-400">No Data Found</h1>
    </div>
  )
}
  return (

    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Best Selling Courses
      </h2>
      <div className="rounded-lg flex items-center justify-center">
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50vw]">Course title</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Enrolled</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bestCourses.map((course, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
                <div className="flex gap-1 items-center">
                    <img src={course.imageUrl} width={45} alt="course-img"
                    className=" rounded-sm " />
                {course.title}
                </div>
                </TableCell>
            <TableCell>{course.price}</TableCell>
            <TableCell className="text-center">{course.enrolledCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
      </div>
    </div>
  );
};

export default TopSellingCourses;
