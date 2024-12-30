import { getCourseByIdUserApi, purchaseCourseApi } from "@/api/student";
import BreadCrumb from "@/components/common/BreadCrumb/BreadCrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ICourses } from "@/types/course";
import { BadgeInfo, Loader2, Lock, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { config } from "@/config/config";
import { useAppSelector } from "@/app/hooks";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ReactPlayer from "react-player";
import { getVideoUrl } from "@/utils/getVideoUrl";

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
  const [userCoursePurchaseStatus, setUserCoursePurchaseStatus] =
    useState(false);
  const navigate = useNavigate();
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
        console.log(response);
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
    if(!user) {
      toast.error('Please login')
      navigate('/login')
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
      console.log("checkouturl", sessionId);

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

  return (
    <div className="mt-10 space-y-5">
      <BreadCrumb />
      <div className="bg-blue-500 bg-gradient-to-r from-blue-500 to-sky-400 text-white ">
        <div className="max-w-7xl flex flex-col md:flex-row mx-auto py-8 px-4 md:px-8 justify-between">
          <div className="flex flex-col gap-2 ">
            <div className="text-xs bg-blue-200 text-blue-600 w-max h-max py-1 rounded-full px-2">
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
          </div>
          <div className="place-content-center mt-6 md:mt-0">
            <img
              className="rounded-xl w-[450px] md:w-[350px]"
              src={course?.imageUrl}
              alt="Course image"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-2">
        <div className="w-full lg:w-1/2 space-y-5">
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

        <div className="w-full lg:w-1/3 ">
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
                                    url={getVideoUrl(course._id,video._id) || ""}
                                    controls
                                    width="100%"
                                    height="100%"
                                  />
                                  <span className="">{video.title || ""}</span>
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
              <Separator className="my-2" />
              <div className="flex gap-2">
                <h1 className="text-lg md:text-lg font-semibold">
                  Course price
                </h1>
                <h1 className="text-lg md:text-xl font-bold">
                  ₹{course?.price}
                </h1>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {userCoursePurchaseStatus ? (
                <Link to={"lectures"} className="w-full">
                  <Button className="w-full">Continue course</Button>
                </Link>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading && <Loader2 className="animate-spin" />}
                  Purchase course
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
