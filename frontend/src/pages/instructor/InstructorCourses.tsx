import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { ICourses } from "@/types/course";
import {
  deleteCourseApi,
  getAllCoursesListApi,
  publishCourseApi,
} from "@/api/instructorApi";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IoSearchOutline } from "react-icons/io5";
import PaginationComponent from "@/components/common/Pagination/Pagination";
import LoadingScreen from "@/components/common/Loading/LoadingScreen";

const InstructorCourses = () => {
  const [courses, setCourses] = useState<ICourses[] | []>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getAllCoursesListApi();
        setCourses(response.data);
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

  const handleEditButton = (courseId: string) => {
    navigate(`/instructor/courses/${courseId}/edit`);
  };
  const handleOpenCourse = (courseId: string) => {
    navigate(`/instructor/courses/${courseId}/overview`);
  };

  const handleDeleteButton = async () => {
    if (!selectedCourseId) return;
    try {
      const response = await deleteCourseApi(selectedCourseId);
      toast.success(response.data.message || "Course deleted successfully");
      setCourses(
        (prev) =>
          prev?.filter((course) => course._id !== selectedCourseId) || null
      );
    } catch (error) {
      console.error("error deleting course", error);
    }
  };

  const handlePublishCourse = async (courseId: string, isPublished: any) => {
    try {
      setLoading(true);
      const response = await publishCourseApi(courseId, !isPublished);
      setCourses((prev) => {
        if (!prev) return [];

        return prev?.map((course) =>
          course._id === courseId
            ? { ...course, isPublished: !isPublished }
            : course
        );
      });
      toast.success(response.message || "Course publish status changed");
    } catch (error: any) {
      toast.error(error.message || "Error publishing course");
      console.error("error publishing course", error);
    } finally {
      setLoading(false);
    }
  };

  const [filteredCourses, setFilteredCourses] = useState<ICourses[] | []>([]);
  const [searchQuery, setSearchQuery] = useState("");
  //debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredCourses(
        courses.filter((course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, courses]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedData = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="flex flex-col min-h-[90vh] w-full mx-auto">
      <div className="container mx-auto sm:px-4 lg:px-8 px-2 py-8 w-full">
        <div className="flex flex-col w-full">
          <h2 className="text-2xl font-bold text-dark-500 text-center ">
            {" "}
            Courses
          </h2>

          {/* Search bar */}
          <div className="w-max ml-auto mb-2">
            <Link to={"create"} className=" ml-auto">
              <Button className="bg-blue-600 rounded-full hover:bg-blue-700 dark:text-gray-100">
                Create course
              </Button>
            </Link>
          </div>
          <div className=" relative sm:w-1/2 w-full">
            <IoSearchOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-300 place-content-center justify-center text-lg" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses"
              className="pl-10 border w-full border-blue-100 dark:border-slate-700 place-self-center
              rounded-full h-10 shadow-md shadow-blue-100 dark:shadow-slate-800"
            />
          </div>
          {paginatedData?.length ? (
            <div className=" bg-blue-100 dark:bg-blue-400 mt-2 overflow-auto">
              <table className="text-sm text-left w-full rtl:text-right text-gray-500 dark:text-gray-400 overflow-x-scroll">
                <thead className=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-100">
                  <tr className="bg-blue-200 dark:bg-blue-700 ">
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
                    <th scope="col" className="lg:px-6 px-1 py-4">
                      Price
                    </th>
                    <th scope="col" className="py-4 text-center">
                      Published
                    </th>
                    <th scope="col" className="py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData?.map((item) => (
                    <tr
                      onClick={() => handleOpenCourse(item._id)}
                      key={item._id}
                      className="odd:bg-white  odd:dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-slate-700 even:bg-gray-50
       even:dark:bg-gray-800 border-b dark:border-gray-700 dark:text-gray-300"
                    >
                      <td
                        scope="row"
                        className="lg:px-6 px-1 py-4 font-medium text-gray-900
                          dark:text-white max-w-56"
                      >
                        {item.title}
                      </td>
                      <td
                        scope="row"
                        className="lg:px-6 px-1 py-4"
                      >{`${item.instructor?.firstName} ${item.instructor?.lastName}`}</td>
                      <td className="lg:px-6 px-1 py-4">
                        {new Date(item.createdAt).toDateString()}
                      </td>
                      <td className="lg:px-6 px-1 py-4">
                        <div>{item.category?.name}</div>
                      </td>
                      <td className="lg:px-6 px-1 py-4 font-medium">
                        <div>₹{item.price}</div>
                      </td>
                      <td className="lg:px-6 px-1 py-4 place-items-center">
                        <div>
                          {item.isPublished ? (
                            <IoCheckmarkCircleOutline className="text-emerald-500 text-xl" />
                          ) : (
                            <IoCloseCircleOutline className="text-red-500 text-xl" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2">
                            <SlOptionsVertical />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditButton(item._id);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePublishCourse(item._id, item.isPublished);
                              }}
                            >
                              Publish/Unpublish
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCourseId(item._id);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center mt-5 text-lg font-bold text-slate-600">
              No courses
            </div>
          )}
        </div>
      </div>
      {/* AlertDialog */}
      <AlertDialog
        open={!!selectedCourseId}
        onOpenChange={() => setSelectedCourseId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              course.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setSelectedCourseId(null)}
              className="rounded-full"
            >
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

      <div className="w-full mt-auto pb-2">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default InstructorCourses;
