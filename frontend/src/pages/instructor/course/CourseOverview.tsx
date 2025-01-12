import {
  deleteCourseApi,
  getCourseById,
  publishCourseApi,
} from "@/api/instructorApi";
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
import LoadingScreen from "@/components/common/Loading/LoadingScreen";

const CourseOverview = () => {
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
        const response = await getCourseById(courseId);
        setCourse(response.data);
      } catch (error: any) {
        toast.error(error.message || "failed to fetch course");
        navigate("/instructor/courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, []);

  const handleBackToCourses = () => {
    navigate("/instructor/courses");
  };

  const handleEditCourse = () => {
    navigate(`/instructor/courses/${courseId}/edit`);
  };

  const handleDeleteCourse = async () => {
    if (!courseId) {
      return alert("Id not found");
    }
    try {
      const response = await deleteCourseApi(courseId);
      toast.success(response.message || "Course deleted successfully");
      navigate("/instructor/courses");
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
      const response = await publishCourseApi(courseId, publishValue);
      toast.success(response.message || "Course publish status changed");
      setCourse((prev: any) => ({ ...prev, isPublished: publishValue }));
    } catch (error: any) {
      toast.error(error.message || "Error publishing course");
      console.error("error publishing course", error);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="container mx-auto px-4 md:px-10 py-2 w-full max-w-4xl">
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
                <AlertDialogTrigger className="bg-blue-600 rounded-full hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 font-medium p-2 px-4 text-white">
                  Publish
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
                <AlertDialogTrigger className="rounded-full hover:text-blue-600 hover:border-blue-600 border font-medium p-2 px-4">
                  Unpublish
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

        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-5 text-slate-800 bg-slate-100 dark:text-gray-100 dark:bg-slate-800 p-3 rounded-lg">
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
                <div className="space-x-1 place-self-end flex">
                  <Button
                    size="icon"
                    onClick={() => handleEditCourse()}
                    className="dark:bg-slate-900 dark:text-white dark:hover:bg-slate-700"
                  >
                    <PiNotePencil />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger className="bg-red-600 hover:bg-red-500 p-2 rounded-md flex items-center justify-center">
                      <LiaTrashAlt className="text-white" size={20} />
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
          {!course?.lectures || course.lectures.length == 0 ? (
            <div>
              <h1 className="text-xl text-slate-800 font-bold">
                No Lectures available
              </h1>
            </div>
          ) : (
            <div className="mt-4 text-slate-800 dark:text-gray-100">
              <h2 className="font-bold text-xl mb-2">Course content</h2>
              <div className="bg-slate-100 dark:text-gray-100 dark:bg-slate-800 p-2 rounded-lg">
                <ol className=" space-y-2">
                  {course?.lectures
                    ?.sort((a, b) => a.order - b.order)
                    .map((lecture) => (
                      <div
                        className="bg-white dark:bg-slate-700 p-2 pl-5 rounded-lg"
                        key={lecture._id}
                      >
                        <li className="list-decimal space-y-3">
                          <div className="flex justify-between">
                            <h4 className="font-semibold text-lg">
                              {lecture && lecture.title}
                            </h4>
                            {lecture && (
                              <div>
                                {lecture.isFree ? (
                                  <div className="border border-red-400 px-2 py-1 text-red-400 font-medium">
                                    <span>FREE</span>
                                  </div>
                                ) : (
                                  <div className="border border-green-400 px-2 py-1 text-green-400 font-medium">
                                    <span>PAID</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="space-y-1 ">
                            <span className="uppercase font-semibold">
                              Lecture description :{" "}
                            </span>
                            <p className="text italic">
                              {lecture && lecture.description}
                            </p>
                          </div>
                          <div className="space-y-1 flex gap-2">
                            <span className="uppercase font-semibold">
                              Lecture order : {lecture && lecture.order}
                            </span>
                          </div>
                          <div>
                            <h5 className="font-semibold uppercase">
                              Lecture videos : (
                              {lecture && lecture.videos.length} No/s)
                            </h5>
                            <div className="flex flex-col sm:flex-row  gap-2  border p-3 rounded-lg">
                              {lecture.videos.map((video, index) => (
                                <div
                                  key={index}
                                  className="flex flex-col w-max p-2 rounded-lg gap-1 bg-slate-100 dark:bg-slate-800 justify-between"
                                >
                                  <div className="flex flex-col">
                                    <span className="">
                                      Video title: {video.title}
                                    </span>
                                    <span>
                                      Video duration: {video.duration} sec
                                    </span>
                                  </div>
                                  <video
                                    controls
                                    width="250"
                                    className="rounded-lg"
                                  >
                                    <source src={video.url || ""} />
                                  </video>
                                </div>
                              ))}
                            </div>
                          </div>
                        </li>
                      </div>
                    ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
