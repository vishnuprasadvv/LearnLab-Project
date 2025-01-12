import {
  addToWishlistApi,
  getCourseByIdUserApi,
  purchaseCourseApi,
  removeFromWishlistApi,
} from "@/api/student";
import BreadCrumb from "@/components/common/BreadCrumb/BreadCrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ICourses } from "@/types/course";
import { BadgeInfo, Loader2, Lock, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { config } from "@/config/config";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ReactPlayer from "react-player";
import { getVideoUrl } from "@/utils/getVideoUrl";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { addIdToWishlist, removeIdFromWishlist } from "@/features/wishlistSlice";
import CourseRatingComponent from "./CourseRatingComponent";
import { Rating } from "@mui/material";
import NotFound from "@/pages/NotFound";
import LoadingScreen from "@/components/common/Loading/LoadingScreen";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Course {
  courseId: string;
  courseTitle: string;
  coursePrice: Number;
  courseImage: string;
  courseInstructor?: string;
  courseLevel?: string;
  courseDescription?: string;
  courseDuration?: number;
  courseLecturesCount?: number;
  courseInstructorImage?: string;
  courseCategory?: string;
}

const stripePromise = loadStripe(config.stripe.STRIPE_PUBLISHABLE_KEY);
const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<ICourses | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [userCoursePurchaseStatus, setUserCoursePurchaseStatus] =
    useState(false);
  const [userCourseWishlistedStatus, setUserCourseWishlistedStatus] =
    useState(false);
  const navigate = useNavigate();

  if (!id) {
    toast.error("Course not found");
    navigate(-1);
    return;
  }
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) {
        throw new Error("Course id not found");
      }
      try {
        setLoading(true);
        let userId = null;
        if (user?._id) {
          userId = user._id;
        }
        const response = await getCourseByIdUserApi(id, userId);
        setCourse(response.data);
        setUserCoursePurchaseStatus(response.purchaseStatus);
        setUserCourseWishlistedStatus(response.wishlisted);
      } catch (error: any) {
        toast.error(error.message || "failed to fetch course");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, []);

  const handleCheckout = async () => {
    if (!course) {
      throw new Error("course not found");
    }
    if (!user) {
      toast.error("Please login");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const courseProps: Course = {
        courseId: course?._id,
        courseTitle: course.title,
        courseDescription: course.description,
        courseImage: course.imageUrl || "",
        coursePrice: course.price,
        courseInstructor: `${course.instructor.firstName} ${course.instructor.lastName}`,
        courseInstructorImage: course.instructor.profileImageUrl,
        courseLevel: course.level,
        courseDuration: course.duration,
        courseLecturesCount: course.lectures?.length,
        courseCategory: course.category?.name,
      };
      const response = await purchaseCourseApi([courseProps]);
      const sessionId = response.sessionId;

      if (sessionId) {
        const stripe = await stripePromise;
        stripe?.redirectToCheckout({ sessionId: sessionId });
      } else {
        console.error("Session ID not found in the URL");
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error("Checkout error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if(!user || !user._id){
      toast.error("Please login")
      navigate('/login')
      return;
    }
    try {
      const response = await addToWishlistApi(id);
      toast.success(response.message || "Course added to wishlist");
      setUserCourseWishlistedStatus(true)
      dispatch(addIdToWishlist({courseId: id}))
    } catch (error: any) {
      console.error("add to wishlist error", error.response.data);
      toast.error(error.response.data.message || "Error adding to wishlist");
    }
  };
  const handleRemoveFromWishlist = async () => {
    if(!user || !user._id){
      toast.error("Please login")
      navigate('/login')
      return;
    }
    try {
      const response = await removeFromWishlistApi(id);
      toast.success(response.message || "Course removed from wishlist");
      setUserCourseWishlistedStatus(false)
      dispatch(removeIdFromWishlist({courseId:id}))
    } catch (error: any) {
      console.error("remove from wishlist error", error);
      toast.error(
        error.response.data.message || "Error removing from wishlist"
      );
    }
  };

  if(loading ) {
    return <LoadingScreen/>
  }
  if(course === null) {
    return (<NotFound/>)
  }

  return (
    <div className="mt-10 space-y-5 max-w-7xl w-full place-self-center">
      <BreadCrumb />
      <div className="bg-gradient-to-r from-blue-500 to-sky-400 dark:from-blue-900 dark:to-indigo-800 text-white ">
        <div className="max-w-7xl flex flex-col md:flex-row mx-auto py-8 px-4 md:px-8 justify-between">
          
          <div className="flex flex-col gap-2">
            <div className="text-xs bg-blue-200 text-blue-600 dark:bg-blue-600 dark:text-gray-100 w-max h-max py-1 rounded-full px-2">
              {course?.category?.name || "category"}
            </div>
            <h1 className="font-bold text-2xl md:text-3xl">{course?.title}</h1>
            <p>
              Created by{" "}
              <span className="text-slate-100 underline italic">
                {`${course?.instructor.firstName} ${course?.instructor.lastName}` ||
                  "instructor name"}
              </span>
            </p>
            <div className="flex items-center gap-2 text-sm">
              <BadgeInfo size={16} />
              <p>
                Last updated :{" "}
                {course?.updatedAt
                  ? new Date(course.updatedAt).toDateString()
                  : "N/A"}
              </p>
            </div>
            <p>Students enrolled : {course?.enrolledCount}</p>
            <div className="flex gap-1 items-center">
            <Rating value={course?.averageRating || 0} readOnly/>
            <span>({course?.ratingsCount || 0})</span>
            </div>
            <div className="flex gap-2 items-center">
                <h1 className="">
                  Course price : 
                </h1>
                <h1 className="text-lg md:text-xl font-bold">
                  ₹{course?.price}
                </h1>
              </div>
          </div>
          <div className="place-content-center mt-6 md:mt-0 justify-items-center">
            <img
              className="rounded-xl w-[450px] md:w-[350px]"
              src={course?.imageUrl}
              alt="Course image"
            />
          </div>
          </div>
        <div className="flex items-center justify-center pb-3 md:w-1/2 px-5">
        <div className="flex space-x-5 w-full justify-between">
        {userCoursePurchaseStatus ? (
                <Link to={"lectures"} className="w-1/2 text-slate-800 dark:text-white dark:bg-slate-800 dark:hover:bg-slate-900 dark:hover:text-blue-700 bg-white hover:bg-gray-100 hover:text-blue-600 flex justify-center items-center font-medium rounded-md shadow-md px-3 py-2 gap-1">
                  <button>Continue course</button>
                </Link>
              ) : (
                <button
                  className="w-1/2 text-slate-800  dark:text-white dark:bg-slate-800 dark:hover:bg-slate-900 dark:hover:text-blue-700 bg-white hover:bg-gray-100 hover:text-blue-600 flex justify-center items-center font-medium rounded-md shadow-md px-3 py-2 gap-1"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading && <Loader2 className="animate-spin" />}
                  Purchase course
                </button>
              )}

          {userCourseWishlistedStatus ? (
            <button
              onClick={handleRemoveFromWishlist}
              className="w-1/2 text-slate-800  dark:text-white dark:bg-slate-800 dark:hover:bg-slate-900 dark:hover:text-blue-700 bg-white hover:bg-gray-100 hover:text-blue-600 flex justify-center items-center font-medium rounded-md shadow-md px-3 py-2 gap-1"
            >
              <IoMdHeart className="text-red-500 text-2xl" />
              Remove from wishlist
            </button>
          ) : (
            <button
              onClick={handleAddToWishlist}
              className="w-1/2 text-slate-800  dark:text-white dark:bg-slate-800 dark:hover:bg-slate-900 dark:hover:text-blue-700 flex justify-center items-center font-medium rounded-md hover:bg-gray-100 hover:text-blue-600 bg-white shadow-md px-3 py-2 gap-1"
            >
              <IoMdHeartEmpty className="text-2xl" />
              Add to wishlist
            </button>
          )}
           </div>
        </div>
      </div>

      <div className="w-full p-10">
              {course?.lectures?.some((lecture) => lecture.isFree) && (
          <Card>
            <CardContent className="p-4 flex flex-col">
                <div className="w-full place-self-center px-10">
                  <Carousel>
                    <CarouselContent>
                      {course?.lectures &&
                        course.lectures
                          .filter((lecture) => lecture.isFree)
                          .flatMap((lecture) => lecture.videos)
                          .map((video, index) => (
                            <CarouselItem key={index}>
                              <div className="">
                                <div className="flex items-center justify-center py-2">
                                  <CardContent
                                    className="relative w-full pb-0"
                                    style={{ aspectRatio: "16/9" }}
                                  >
                                    <ReactPlayer
                                      url={
                                        getVideoUrl(course._id, video._id) || ""
                                      }
                                      // Disable download button
                                      config={{
                                        file: {
                                          attributes: {
                                            controlsList: "nodownload",
                                          },
                                        },
                                      }}
                                      // Disable right click
                                      onContextMenu={(e: React.MouseEvent) =>
                                        e.preventDefault()
                                      }
                                      controls
                                      width="100%"
                                      height="100%"
                                    />
                                    <h3 className=" pt-3 uppercase">
                                      {video.title || ""}
                                    </h3>
                                  </CardContent>
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-3" />
                    <CarouselNext className="-right-3" />
                  </Carousel>
                </div>
            </CardContent>
          </Card>
              )}
        </div>

      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-2">
      
      <Tabs defaultValue="about" className="w-full max-h-screen overflow-hidden">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="ratings">Review & rating</TabsTrigger>
      </TabsList>
      <TabsContent value="about" className="overflow-y-auto max-h-[calc(100vh-50px)] p-4">
        <div className="w-full space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p className="text-sm">{course?.description}</p>
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                {course?.lectures?.length} lectures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course?.lectures
                ?.sort((a, b) => a.order - b.order)
                .map((lecture, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <span>
                      {lecture.isFree ? (
                        <PlayCircle size={14} />
                      ) : (
                        <Lock size={14} />
                      )}
                    </span>
                    <p>{lecture.title || "Lecture title"}</p>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
        </TabsContent>
        {/* Rating */}
        <TabsContent value="ratings" className="overflow-y-auto max-h-[calc(100vh-50px)] p-4">
        <div>
          <CourseRatingComponent courseId={id} purchased={userCoursePurchaseStatus} setCourse={setCourse} course={course}/>
        </div>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetails;
