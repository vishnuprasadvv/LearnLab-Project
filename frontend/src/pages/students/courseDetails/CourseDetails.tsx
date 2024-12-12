import { getAllCoursesUserApi, getCourseByIdUserApi } from "@/api/student";
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
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetails = () => {
  const {id} = useParams()
   const [course, setCourse] = useState<ICourses | null>(null);
   const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) {
        throw new Error("Course id not found");
      }
      try {
        setLoading(true);
        const response = await getCourseByIdUserApi(id);
        setCourse(response.data);
      } catch (error: any) {
        toast.error(error.message || "failed to fetch course");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, []);
  
    const purchasedCourse = true
  return (
    <div className="mt-20 space-y-5">
      <div className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">{course?.title}</h1>
          <p className="text-base md:text-lg">Course subtitle</p>
          <p>
            Created by{" "}
            <span className="text-slate-100 underline italic">
              instructor name
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated 12-10-2022</p>
          </div>
          <p>Students enrolled : 10</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-2">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p className="text-sm">
            decriptinosdklfjskldfjskljflsjdflksjdflsdfsksdjflksd
            flksdfjlksdjflsldfsdjflk
          </p>
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>4 lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4].map((lecture, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <span>
                    {true ? <PlayCircle size={14} /> : <Lock size={14} />}
                  </span>
                  <p>Lecture title</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-1/3 ">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">react plyer Video</div>
              <h1>Lecture Title</h1>
              <Separator className="my-2" />
              <h1 className="text-lg md:text-xl font-semibold">Course price</h1>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
                {
                    purchasedCourse ? (
                        <Button className="w-full">Continue course</Button>
                    ) : (
                        <Button className="w-full">Purchase course</Button>
                    )
                }
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
