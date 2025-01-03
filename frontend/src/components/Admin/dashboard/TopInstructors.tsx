import { getTopInstructorsApi } from "@/api/adminApi";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TOP_INSTRUCTORS_LIMIT_ADMIN } from "@/config/paginationConifig";

import React, { useEffect, useState } from "react";


interface ITopInstructors {
    name: string,
    profileImageUrl: string,
    instructorId: string, 
    totalRevenue: number,
    totalSales: number,
}
const TopInstructors: React.FC = () => {

    const limit = TOP_INSTRUCTORS_LIMIT_ADMIN || 5
    const [topInstructors , setTopInstructors] = useState<ITopInstructors[] | []>([])
      useEffect(() => {
        const getTopInstructors = async() => {
            try {
                const response = await getTopInstructorsApi(limit)
                console.log(response)
                setTopInstructors(response.data)
            } catch (error) {
                console.error('fetching top courses error', error)
            }
        }
        getTopInstructors()
      }, [])

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Top Instructors
      </h2>
      <div className="rounded-lg flex items-center justify-center">
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50vw]">Instructor name</TableHead>
          <TableHead>Sales</TableHead>
          <TableHead>Enroll</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topInstructors.map((instructor, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
                <div className="flex gap-1 items-center">
                    <img src={instructor.profileImageUrl} width={45} alt="course-img"
                    className=" rounded-full " />
                {instructor.name || ''}
                </div>
                </TableCell>
            <TableCell>{instructor.totalRevenue}</TableCell>
            <TableCell className="text-center">{instructor.totalSales}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
      </div>
    </div>
  );
};

export default TopInstructors;
