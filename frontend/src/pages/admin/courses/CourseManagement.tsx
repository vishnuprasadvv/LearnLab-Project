import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ICourses } from "@/types/course";
import toast from "react-hot-toast";
import { SlOptionsVertical } from "react-icons/sl";
import { IoCloseCircleOutline, IoSearchOutline } from "react-icons/io5";
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
import { Input } from "@/components/ui/input";
import {
  deleteCourseAdminApi,
  getAllCoursesAdminApi,
  publishCourseAdminApi,
} from "@/api/adminApi";
import { ITEMS_PER_PAGE } from "@/config/paginationConifig";
import PaginationComponent from "@/components/common/Pagination/Pagination";
import CourseFilter from "@/components/Admin/courses/CourseFilter";
import ResultsNotFound from "@/components/common/NoResults/ResultsNotFound";
import LoadingScreen from "@/components/common/Loading/LoadingScreen";

interface Filters {
  categories: string[];
  sortBy: string;
  rating: number | null;
  level: string | null;
}

const AdminCourseManagement = () => {
  const [courses, setCourses] = useState<ICourses[] | []>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  //search and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCourses, setTotalCourses] = useState("");
  const itemsPerPage = ITEMS_PER_PAGE;

  const [filters, setFilters] = useState<Filters>({
    categories: [],
    sortBy: "",
    rating: null,
    level: null,
  });

  const handleFilterChange = (updatedFilters: {
    categories: string[];
    sortBy: string;
    rating: number | null;
    level: string | null;
  }) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...updatedFilters,
    }));
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const { categories, sortBy, rating, level } = filters;
      try {
        setLoading(true);
        const response = await getAllCoursesAdminApi({
          categories: categories.length > 0 ? categories.join(",") : undefined,
          sortBy: sortBy || undefined,
          rating: rating || undefined,
          level: level || undefined,
          page: currentPage,
          limit: itemsPerPage,
          query: searchQuery,
        });
        setCourses(response.data.courses);
        //set values for pagination
        setTotalPages(response.data.totalPages);
        setTotalCourses(response.data.totalCourses);
      } catch (error: any) {
        toast.error(error.message || "failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery === "") {
      fetchCourses();
      return;
    }

    const debounceFetch = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [searchQuery, currentPage, filters]);

  useEffect(() => {
    if (searchQuery !== "") {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const handleOpenCourse = (courseId: string) => {
    navigate(`/admin/courses/${courseId}/overview`);
  };

  const handleDeleteButton = async () => {
    if (!selectedCourseId) return;
    try {
      const response = await deleteCourseAdminApi(selectedCourseId);
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
      const response = await publishCourseAdminApi(courseId, !isPublished);
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

  return (
    <div className="container mx-auto md:px-4 px-2 py-8 w-full flex flex-col">
      <div className="">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-dark-500 text-center ">
            {" "}
            Courses
          </h2>

          {/* Search bar */}
          <div className="flex lg:flex-row flex-col justify-between gap-2 max-w-full">
            <div className=" relative lg:w-1/2 w-full flex">
              <IoSearchOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 place-content-center justify-center text-lg" />
              <Input
                type="text"
                placeholder="Search courses"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border w-full border-blue-100 place-self-center
              rounded-full h-10 shadow-md shadow-blue-100"
              />
            </div>
            <div className="flex">
              <CourseFilter onFilterChange={handleFilterChange} />
            </div>
          </div>
          <div className="font-medium pt-2">TOTAL : {totalCourses} no/s</div>

          {loading ? (
            <LoadingScreen />
          ) : courses.length !== 0 ? (
            <div className=" bg-blue-100 overflow-auto mt-2">
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
                    <th scope="col" className="py-4"></th>
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
                        className=" lg:px-6 px-1 py-4 font-medium text-gray-900 dark:text-white"
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
            <ResultsNotFound />
          )}
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
      </div>
      <div className="mt-auto pt-5">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default AdminCourseManagement;
