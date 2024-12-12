
  import { ICourses } from "@/types/course";
  import { useEffect, useState } from "react";
  import toast from "react-hot-toast";
  import { useNavigate, useParams } from "react-router-dom";
  import { IoCalendarOutline } from "react-icons/io5";
  import { IoIosTimer } from "react-icons/io";
  import { Button } from "@/components/ui/button";
  import { LiaTrashAlt } from "react-icons/lia";
  import { PiNotePencil } from "react-icons/pi";
  import { IoArrowBack } from "react-icons/io5";
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import { deleteCourseAdminApi, getCourseByIdAdminApi, publishCourseAdminApi } from "@/api/adminApi";
  
  const CourseOverviewAdmin = () => {
    const [course, setCourse] = useState<ICourses | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { courseId } = useParams();
    useEffect(() => {
      const fetchCourse = async () => {
        if (!courseId) {
          throw new Error("Course id not found");
        }
        try {
          setLoading(true);
          const response = await getCourseByIdAdminApi(courseId);
          setCourse(response.data);
        } catch (error: any) {
          toast.error(error.message || "failed to fetch course");
          navigate("/admin/courses");
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }, []);
  
    const handleBackToCourses = () => {
      navigate("/admin/courses");
    };
  
    const handleEditCourse = () => {
      navigate(`/admin/courses/${courseId}/edit`);
    };
  
    const handleDeleteCourse = async () => {
      if (!courseId) {
        return alert("Id not found");
      }
      try {
        const response = await deleteCourseAdminApi(courseId);
        console.log(response);
        toast.success(response.message || "Course deleted successfully");
        navigate("/admin/courses");
      } catch (error) {
        console.error("error deleting course", error);
      }
    };
  
    const handlePublishCourse = async (publishValue: boolean) => {
      if (!courseId) {
        return alert("Id not found");
      }
      try {
        setLoading(true);
        const response = await publishCourseAdminApi(courseId, publishValue);
        console.log(response);
        toast.success(response.message || "Course publish status changed");
        setCourse((prev: any) => ({ ...prev, isPublished: publishValue }));
      } catch (error: any) {
        toast.error(error.message || "Error publishing course");
        console.error("error publishing course", error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="container mx-auto px-4 md:px-10 py-2 w-full">
        <div
          className="flex gap-1 items-center hover:text-blue-600 cursor-pointer"
          onClick={handleBackToCourses}
        >
          <IoArrowBack />
          <span>Back to courses</span>
        </div>
        <div className="flex flex-col w-full pt-4">
          <div className="flex justify-between items-center pb-2">
            <h1 className="text-xl font-bold">Course overview</h1>
            <div className="space-x-2">
              {course && !course.isPublished ? (
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button className="bg-blue-600 rounded-full hover:bg-blue-500">
                      Publish
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will publish the course. Are you sure?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-full">
                        No
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-blue-600 rounded-full"
                        onClick={() => handlePublishCourse(true)}
                      >
                        Yes
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button
                      variant="outline"
                      className="rounded-full hover:bg-gray-100"
                    >
                      Unpublish
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will unpublish the course. Are you sure?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-full">
                        No
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-blue-600 rounded-full"
                        onClick={() => handlePublishCourse(false)}
                      >
                        Yes
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
  
          <div className="flex flex-col">
            <div className="flex flex-row gap-5 text-slate-800 bg-slate-100 p-3 rounded-lg">
              <div className="flex gap-2 flex-col sm:flex-row w-full">
                <div className="sm:w-2/3 xl:w-3/4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-xs bg-blue-200 text-blue-600 w-max h-max py-1 rounded-full px-2">
                      {course?.category?.name || "category"}
                    </div>
  
                    {course?.isPublished ? (
                      <div className="text-xs bg-emerald-200 text-emerald-600 w-max h-max py-1 rounded-full px-2">
                        Published
                      </div>
                    ) : (
                      <div className="text-xs bg-yellow-200 text-yellow-600 w-max h-max py-1 rounded-full px-2">
                        Non published
                      </div>
                    )}
                  </div>
  
                  <h1 className="text-lg font-bold text-blue-600">
                    {course?.title}
                  </h1>
                  <h2 className="font-semibold uppercase">{`${course?.instructor.firstName} ${course?.instructor.lastName}`}</h2>
                  <div className=" break-words italic">{course?.description}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <IoIosTimer />
                      <h3>Duration : {course?.duration} hrs </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <IoCalendarOutline />
                      <h3>
                        Created at :{" "}
                        {(course && new Date(course?.createdAt).toDateString()) ||
                          "NA"}{" "}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <IoCalendarOutline />
                      <h3>
                        Last updated :{" "}
                        {(course && new Date(course?.updatedAt).toDateString()) ||
                          "NA"}{" "}
                      </h3>
                    </div>
                  </div>
                  <div className="font-bold ">Price ₹{course?.price}</div>
                  <div className="space-x-1 place-self-end">
                    <Button size="icon" onClick={() => handleEditCourse()}>
                      <PiNotePencil />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button
                          size="icon"
                          className="bg-red-600 hover:bg-red-500"
                        >
                          <LiaTrashAlt />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will remove this
                            course completely.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-full">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-blue-600 rounded-full"
                            onClick={handleDeleteCourse}
                          >
                            continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
  
                <div className="mt-2 place-items-center">
                  <div className=" overflow-hidden rounded-lg">
                    <img
                      src={course?.imageUrl || ""}
                      alt="Course Preview"
                      className="w-full h-full object-contain rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-slate-800">
              <h2 className="font-semibold text-lg ">Course content</h2>
              <div className="bg-slate-100 p-2 rounded-lg">
                <ol className=" space-y-2">
                  {course?.lectures?.map((lecture) => (
                    <div className="bg-white p-2 pl-5 rounded-lg">
                      <li className="list-decimal space-y-2">
                        <h4 className="font-semibold">
                          {lecture && lecture.title}
                        </h4>
                        <div className="space-y-1">
                          <span className="">Lecture description : </span>
                          <p className="text-xs italic">
                            {lecture && lecture.description}
                          </p>
                        </div>
                        <div className="space-y-1 flex gap-2">
                          <span className="">Lecture order : </span>
                          <p className="text-xs">{lecture && lecture.order}</p>
                        </div>
                        <div className="space-y-1 flex gap-2">
                          <span className="">Lecture videos : </span>
                          <p className="text-xs">
                            {lecture && lecture.videos.length}
                          </p>
                        </div>
                      </li>
                    </div>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default CourseOverviewAdmin;
  