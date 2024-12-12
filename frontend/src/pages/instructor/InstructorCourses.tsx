import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { ICourses } from "@/types/course";
import { deleteCourseApi, getAllCoursesListApi } from "@/api/instructorApi";
import toast from "react-hot-toast";
import { Input } from "../../components/ui/input";
import { SlOptionsVertical } from "react-icons/sl";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const InstructorCourses = () => {
  const [courses, setCourses] = useState<ICourses[] | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate =  useNavigate()
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getAllCoursesListApi();
        setCourses(response.data);
        console.log(response.data);
      } catch (error: any) {
        toast.error(
          error.response.data || error.message || "failed to fetch courses"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEditButton = (courseId:string) => {
    navigate(`/instructor/courses/${courseId}/edit`)
  }
  const handleOpenCourse = (courseId:string) => {
    navigate(`/instructor/courses/${courseId}/overview`)
  }

  const handleDeleteButton = async() => {
      if (!selectedCourseId) return;
    try {
        const response = await deleteCourseApi(selectedCourseId)
        console.log(response)
        toast.success(response.data.message || 'Course deleted successfully')
        setCourses((prev) => 
        prev?.filter((course) => course._id !== selectedCourseId) || null)
    } catch (error) {

        console.error('error deleting course',error)
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <div className="flex flex-col w-full">
        <h2 className="text-2xl font-bold text-dark-500 text-center ">
          {" "}
          Courses
        </h2>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row ">
          <Input
            type="text"
            placeholder="Search users..."
            className="mb-4 p-2 border w-full border-blue-100 rounded-full h-10 sm:w-1/3 ml-2 shadow-md shadow-blue-100"
          />
          {/* <Button variant='outline' size='icon' onClick={handleSearch}><CiSearch /></Button> */}
          <Link to={"/instructor/courses/create"} className=" ml-auto">
            <Button className="bg-blue-600 rounded-full hover:bg-blue-700">
              Create course
            </Button>
          </Link>
        </div>

        <div className=" bg-blue-100 m-2 overflow-auto">
          <table className="text-sm text-left w-full rtl:text-right text-gray-500 dark:text-gray-400 overflow-x-scroll">
            <thead className=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="bg-blue-200">
                <th scope="col" className="lg:px-6 px-1 py-4">
                  Title
                </th>
                <th scope="col" className="lg:px-6 px-1 py-4">
                  Instructor
                </th>
                <th scope="col" className="lg:px-6 px-1 py-4">
                  Created at
                </th>
                <th scope="col" className="lg:px-6 px-1 py-4">
                  Category
                </th>
                <th scope="col" className="py-4 text-center">
                  Published
                </th>
                <th scope="col" className="py-4">
                </th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((item) => (
                <tr
                onClick={() => handleOpenCourse(item._id)}
                  key={item._id}
                  className="odd:bg-white  odd:dark:bg-gray-900 hover:bg-gray-100 even:bg-gray-50
             even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td
                    scope="row"
                    className=" lg:px-6 px-1 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.title}
                  </td>
                  <td className="lg:px-6 px-1 py-4">{`${item.instructor?.firstName} ${item.instructor?.lastName}`}</td>
                  <td className="lg:px-6 px-1 py-4">
                    {new Date(item.createdAt).toDateString()}
                  </td>
                  <td className="lg:px-6 px-1 py-4">
                    <div>{item.category?.name}</div>
                  </td>
                  <td className="lg:px-6 px-1 py-4 place-items-center">
                    <div>{item.isPublished ? (<IoCheckmarkCircleOutline className="text-emerald-500 text-xl"/>) 
                      : (
                      <IoCloseCircleOutline className="text-red-500 text-xl"/>
                      )
                      }</div>
                  </td>
                  <td className="py-4 text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-2"><SlOptionsVertical /></DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={(e) =>{ 
                          e.stopPropagation()
                          handleEditButton(item._id)}}
                          >Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Publish/Unpublish</DropdownMenuItem>
                        <DropdownMenuSeparator />

                        
                    <DropdownMenuItem className="text-red-500" 
                    onClick={(e) =>{ 
                      e.stopPropagation()
                      setSelectedCourseId(item._id);
                    }}>Delete</DropdownMenuItem>
                         </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AlertDialog */}
      <AlertDialog open={!!selectedCourseId} onOpenChange={() => setSelectedCourseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the course.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCourseId(null)}
              className="rounded-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteButton();
              }}
              className="bg-blue-600 rounded-full hover:bg-blue-500"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InstructorCourses;
