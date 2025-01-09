import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import ReactPlayer from "react-player";
import { IoLogoYoutube } from "react-icons/io5";
import { CheckCircle2, ChevronDown, Lock, PlayCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { ICourses, IVideo } from "@/types/course";
import {
  getCourseByIdUserApi,
  getCourseProgressApi,
  markAsCompletedApi,
  markAsIncompletedApi,
  markVideoCompleteApi,
} from "@/api/student";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getVideoUrl } from "@/utils/getVideoUrl";
import { Progress } from "@/components/ui/progress";
import LoadingScreen from "@/components/common/Loading/LoadingScreen";

interface ProgressVideo {
  videoId: string;
  isCompleted: boolean;
}

interface ProgressLecture {
  lectureId: string;
  completedVideos: ProgressVideo[];
}

interface CourseProgress {
  courseId: string;
  userId: string;
  completedLectures: ProgressLecture[];
  progressPercentage: number;
}

interface ISelectedVideo {
  video: IVideo;
  lectureId: string;
  lectureTitle: string;
  lectureDescription: string;
}
const LectureView: React.FC = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<ICourses | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [userCoursePurchaseStatus, setUserCoursePurchaseStatus] =
    useState(false);
  const [selectedVideo, setSelectedVideo] = useState<ISelectedVideo | null>(
    null
  );
  const navigate = useNavigate();

  if (!id) {
    navigate(-1);
    toast.error("Course details not found");
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
        if (response.data.lectures?.[0].videos?.[0]) {
          setSelectedVideo({
            video: response.data.lectures[0].videos[0],
            lectureId: response.data.lectures[0]._id,
            lectureTitle: response.data.lectures[0].title,
            lectureDescription: response.data.lectures[0].description,
          });
        }
        console.log(response.data);
      } catch (error: any) {
        toast.error(error.message || "failed to fetch course");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, []);

  useEffect(() => {
    const getProgress = async () => {
      try {
        const response = await getCourseProgressApi(id!);
        console.log(response);
        setProgress(response.data);
      } catch (error) {
        console.error("Failed to fetch progress", error);
      }
    };
    getProgress();
  }, [id]);

  const handleMarkVideoComplete = async (
    lectureId: string,
    videoId: string,
    videoTitle: string
  ) => {
    try {
      await markVideoCompleteApi(id!, lectureId, videoId);
      toast.success(`Video ${videoTitle} marked as complete!`);

      // Update progress state locally
      setProgress((prev) => {
        if (!prev) return null;

        const updatedLectures = prev.completedLectures.map((lecture) => {
          if (lecture.lectureId === lectureId) {
            return {
              ...lecture,
              completedVideos: lecture.completedVideos.map((video) =>
                video.videoId === videoId
                  ? { ...video, isCompleted: true }
                  : video
              ),
            };
          }
          return lecture;
        });

        // Calculate progress percentage
        const totalVideos = course?.lectures?.reduce(
          (acc, lecture) => acc + lecture.videos.length,
          0
        );
        const completedVideos = updatedLectures.reduce(
          (acc, lecture) =>
            acc +
            lecture.completedVideos.filter((video) => video.isCompleted).length,
          0
        );

        const progressPercentage =
          totalVideos && completedVideos
            ? (completedVideos / totalVideos) * 100
            : 0;

        return {
          ...prev,
          completedLectures: updatedLectures,
          progressPercentage,
        };
      });
    } catch (error) {
      console.error("Failed to mark video complete:", error);
      toast.error("Error marking video as complete.");
    }
  };

  const handleMarkAsIncompleted = async () => {
    if (!id) return "course id not found";
    try {
      const response = await markAsIncompletedApi(id);
      toast.success(response.message);
      setProgress(response.data);
      console.log(response);
    } catch (error) {
      console.error("failed to mark progress as incompleted", error);
    }
  };
  const handleMarkAsCompleted = async () => {
    if (!id) return "course id not found";
    try {
      const response = await markAsCompletedApi(id);
      console.log(response);
      toast.success(response.message);
      setProgress(response.data);
    } catch (error) {
      console.error("failed to mark progress as completed", error);
    }
  };

  const [openLecture, setOpenLecture] = useState<string | null>(null);

  const toggleLecture = (lectureId: string) => {
    setOpenLecture((prev) => (prev === lectureId ? null : lectureId));
  };

  const videoUrl = selectedVideo
    ? getVideoUrl(id, selectedVideo.video._id)
    : "";

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="flex flex-col sm:flex-row min-h-[90vh] max-w-7xl place-self-center w-full ">
      <div className="flex w-full sm:w-2/3 lg:w-3/4 h-full order-2 sm:order-1 pb-10">
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center bg-blue-500 dark:bg-blue-700 w-full text-white gap-2 p-2 h-16 max-h-16">
            <div className="flex items-center gap-2">
              <div
                className="hover:bg-slate-50 hover:bg-opacity-50 rounded-full p-2 transition-all duration-300"
                onClick={() => navigate(-1)}
              >
                <IoIosArrowBack className="text-xl" />
              </div>
              <div>
                <h1 className="text-lg font-medium">
                  {course?.title || "course title"}
                </h1>
                <h2 className="font-light text-xs">
                  <span>Your progress : </span>
                  {progress?.progressPercentage?.toFixed(2) || 0} %
                </h2>
                <Progress
                  className="bg-white"
                  value={
                    progress?.progressPercentage
                      ? parseFloat(progress.progressPercentage.toFixed(2))
                      : 0
                  }
                />
              </div>
            </div>
            {progress?.progressPercentage == 100 ? (
              <Button
                className="bg-white  dark:bg-slate-800 dark:hover:bg-slate-700 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-blue-500 dark:text-gray-100"
                onClick={() => handleMarkAsIncompleted()}
              >
                Mark as incomplete
              </Button>
            ) : (
              <Button
                className="bg-white dark:bg-slate-800 dark:hover:bg-slate-700 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-blue-500 dark:text-gray-100"
                onClick={() => handleMarkAsCompleted()}
              >
                Mark as complete
              </Button>
            )}
          </div>
          <div className="w-full h-max flex flex-col gap-2">
            <div className="player-wrapper">
              <ReactPlayer
                // Disable download button
                config={{
                  file: { attributes: { controlsList: "nodownload" } },
                }}
                // Disable right click
                onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                className="react-player"
                width="100%"
                height="100%"
                controls
                playing
                url={videoUrl}
                onEnded={() => {
                  if (selectedVideo && id) {
                    handleMarkVideoComplete(
                      selectedVideo.lectureId,
                      selectedVideo.video._id,
                      selectedVideo.video.title
                    );
                  }
                }}
              />
            </div>
            <div className="space-y-2 p-2">
              <h1 className="font-semibold underline underline-offset-2">
                Current video details
              </h1>
              <div className="flex flex-col">
                <span>{selectedVideo?.video.title}</span>
              </div>
            </div>
            <div className="space-y-3 p-2">
              <h1 className="font-semibold underline underline-offset-2">
                About lesson
              </h1>
              <div className="flex flex-col">
                <h3 className="font-bold text-slate-800 dark:text-gray-300">
                  {selectedVideo?.lectureTitle}
                </h3>
                <p className="italic">{selectedVideo?.lectureDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col order-1 sm:order-2 w-full sm:w-1/3 lg:w-1/4 bg-slate-100 dark:bg-slate-800 border border-l-slate-300 dark:border-l-slate-700">
        <h1 className="text-lg font-medium bg-white dark:bg-slate-900 py-3 pl-1 ">
          Table of contents
        </h1>
        <div className="flex">
          <div className="w-full flex items-center shadow-sm">
            <div className="w-full">
              {course?.lectures
                ?.sort((a, b) => a.order - b.order)
                .map((lecture) => (
                  <Collapsible
                    key={lecture._id}
                    open={openLecture === lecture._id}
                    onOpenChange={() => toggleLecture(lecture._id)}
                  >
                    <CollapsibleTrigger
                      className={`w-full flex gap-2 items-center justify-between border border-b-gray-300 dark:border-b-slate-700 min-h-12 max-h-16 py-2 px-2 cursor-pointer ${
                        lecture._id === selectedVideo?.lectureId
                          ? "text-blue-600 bg-blue-100"
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    >
                      <div className=" gap-2 items-center flex">
                        <div className="w-max">
                          {userCoursePurchaseStatus ? (
                            <IoLogoYoutube size={16} />
                          ) : lecture.isFree ? (
                            <IoLogoYoutube size={16} />
                          ) : (
                            <Lock size={16} />
                          )}
                        </div>

                        <h2 className="font-medium max-w-52 text-start">
                          {lecture.title}
                        </h2>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          openLecture === lecture._id
                            ? "rotate-180"
                            : "rotate-0"
                        }`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {lecture.videos.map((video) => {
                        const isCompleted = progress?.completedLectures
                          .find((l) => l.lectureId === lecture._id)
                          ?.completedVideos.some(
                            (v) => v.videoId === video._id && v.isCompleted
                          );
                        return (
                          <div
                            key={video._id}
                            className={`flex gap-2 items-center p-2 pl-6 cursor-pointer w-full ${
                              selectedVideo?.video._id === video._id
                                ? "bg-blue-600 border dark:bg-blue-700 dark:hover:bg-blue-600 shadow-md text-white hover:bg-blue-500"
                                : "bg-white dark:bg-slate-600 hover:bg-slate-100 dark:hover:bg-slate-500"
                            }`}
                            onClick={() =>
                              setSelectedVideo({
                                video: video,
                                lectureId: lecture._id,
                                lectureTitle: lecture.title,
                                lectureDescription: lecture.description,
                              })
                            }
                          >
                            {isCompleted ? (
                              <CheckCircle2
                                size={18}
                                className="text-green-500"
                              />
                            ) : (
                              <PlayCircle size={18} />
                            )}
                            <span className="text-xs">
                              {video.title || "Video Title"}
                            </span>
                          </div>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureView;
