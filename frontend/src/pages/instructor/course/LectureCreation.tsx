import React, { useEffect, useState } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  FormProvider,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { CourseData, courseSchema } from "@/utils/lectureSchemaValidation";
import {
  CheckCheckIcon,
  LayoutDashboard,
  Plus,
  PlusCircle,
  Trash,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createCourseLectureApi } from "@/api/instructorApi";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosProgressEvent } from "axios";
import { Progress } from "@/components/ui/progress";
import CustomToggleButton from "@/components/common/ToggleButton/ToggleButton";
import VideoUpload from "./components/VideoUpload";

const LectureCreation: React.FC = () => {
  const { courseId } = useParams();
  const course_title = sessionStorage.getItem("courseTitle");
  const [courseTitle, setCourseTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (course_title) {
      setCourseTitle(course_title);
    }
  }, []);
  const methods = useForm<CourseData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      lectures: [
        {
          title: "",
          order: 1,
          description: "",
          isFree: false,
          videos: [
            {
              title: "",
              order: 1,
              duration: 0,
              file: "",
            },
          ],
        },
      ],
    },
    mode: "onBlur",
    shouldUseNativeValidation: false,
  });

  const {
    control,
    handleSubmit,
  } = methods;

  const {
    fields: lectureFields,
    append: addLecture,
    remove: removeLecture,
  } = useFieldArray({
    control,
    name: "lectures",
  });

  const handleAddLecture = () => {
    addLecture({
      title: "",
      order: lectureFields.length + 1,
      description: "",
      isFree: false,
      videos: [],
    });
  };

  const onSubmit = async (data: CourseData) => {
    if (isUploading) {
      toast.error("An upload is already in progress.");
      return;
    }
    setIsUploading(true);
    try {
      if (!courseId) {
        throw new Error("Course id not found");
      }
      const formData = new FormData();
      data.lectures.forEach((lecture, lectureIndex) => {
        lecture.videos.forEach((video, videoIndex) => {
          if (video.file) {
            //append each video file
            formData.append(
              `lectures[${lectureIndex}].videos[${videoIndex}].file`,
              video.file
            );
          }
          //append other fields
          formData.append(
            `lectures[${lectureIndex}].videos[${videoIndex}].title`,
            video.title
          );
          formData.append(
            `lectures[${lectureIndex}].videos[${videoIndex}].duration`,
            video.duration.toString()
          );
          formData.append(
            `lectures[${lectureIndex}].videos[${videoIndex}].order`,
            video.order.toString()
          );
        });

        formData.append(`lectures[${lectureIndex}].title`, lecture.title);
        formData.append(
          `lectures[${lectureIndex}].description`,
          lecture.description
        );
        formData.append(
          `lectures[${lectureIndex}].isFree`,
          lecture.isFree.toString()
        );
        formData.append(
          `lectures[${lectureIndex}].order`,
          lecture.order.toString()
        );
      });

      toast.loading("Uploading lectures...");

      const response = await createCourseLectureApi(
        formData,
        courseId,
        (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percent =
              Math.floor((progressEvent.loaded / progressEvent.total) * 100) |
              0;
            setProgress(percent);
          }
        }
      );
      toast.dismiss(); //clear the loading toast
      navigate(`/instructor/courses/${courseId}/overview`);
      toast.success(
        response.message || "Course and lectures added successfully!"
      );
    } catch (error: any) {
      if (axios.isCancel(error)) {
        toast.dismiss();
        toast.error("Upload canceled");
      } else {
        toast.dismiss();
        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Failed to create lectures"
        );
      }
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };


  return (
    <div className="container mx-auto px-4 md:px-10 py-8 w-full">
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-x-2">
          <div className="rounded-full bg-sky-200 p-1">
            <LayoutDashboard className="text-sky-800" />
          </div>
          <h2 className="text-xl font-semibold">Add Lectures to Course</h2>
        </div>
        <div className="mt-3 ml-5">
          <span className="italic">Course title : </span>
          <span className="text-lg italic font-semibold text-slate-800 dark:text-gray-100">
            {courseTitle}
          </span>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {lectureFields.map((lecture, lectureIndex) => (
              <div
                key={lecture.id}
                className="space-y-4 border rounded-lg p-5 bg-slate-100 dark:text-gray-100 dark:bg-slate-800 text-slate-800 mt-2"
              >
                <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100 italic">
                  Lecture {lectureIndex + 1}
                </h2>
                <div className="sm:grid grid-cols-2 gap-3">
                  <div>
                    <FormField
                      name={`lectures.${lectureIndex}.title`}
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lecture title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Lecture Title"
                              className="bg-white dark:bg-slate-700"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      name={`lectures.${lectureIndex}.order`}
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lecture order</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Lecture order"
                              className="bg-white dark:bg-slate-700"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div>
                  <FormField
                    name={`lectures.${lectureIndex}.description`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lecture description</FormLabel>
                        <FormControl>
                          <Textarea
                            className="bg-white dark:bg-slate-700"
                            placeholder="e.g. 'This lecture includes'..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    name={`lectures.${lectureIndex}.isFree`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lecture is Free?</FormLabel>
                        <FormControl>
                          <CustomToggleButton
                            isChecked={field.value}
                            onToggle={(value) => field.onChange(value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-slate-300 dark:bg-slate-700 p-3 rounded-xl my-3">
                  <Controller
                    name={`lectures.${lectureIndex}.videos`}
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <div>
                        <h3 className="font-bold text-slate-600 dark:text-gray-100 pb-3 text-lg underline-offset-4 underline">
                          Videos
                        </h3>
                        {field.value.map((video, videoIndex) => (
                          <div
                            key={videoIndex}
                            style={{ marginBottom: "1rem" }}
                            className="p-3 space-y-3 bg-slate-200 dark:bg-slate-600 rounded-xl"
                          >
                            <div>
                              <FormField
                                name={`lectures.${lectureIndex}.videos.${videoIndex}.title`}
                                control={control}
                                render={({ field: titleField }) => (
                                  <FormItem>
                                    <FormLabel>Video Title</FormLabel>
                                    <FormControl>
                                      <Input
                                        className="bg-white dark:bg-slate-700"
                                        placeholder="Video Title"
                                        {...titleField}
                                        value={video.title}
                                        onChange={(e) =>
                                          field.onChange([
                                            ...field.value.slice(0, videoIndex),
                                            { ...video, title: e.target.value },
                                            ...field.value.slice(
                                              videoIndex + 1
                                            ),
                                          ])
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="flex gap-5">
                              <div className="w-1/2">
                                {/* Video Duration */}
                                <FormField
                                  name={`lectures.${lectureIndex}.videos.${videoIndex}.duration`}
                                  control={control}
                                  render={({ field: durationField }) => (
                                    <FormItem>
                                      <FormLabel className="whitespace-nowrap overflow-hidden text-ellipsis">
                                        Video Duration(seconds)
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          className="bg-white dark:bg-slate-700"
                                          type="number"
                                          placeholder="Video Duration"
                                          {...durationField}
                                          value={video.duration}
                                          onChange={(e) =>
                                            field.onChange([
                                              ...field.value.slice(
                                                0,
                                                videoIndex
                                              ),
                                              {
                                                ...video,
                                                duration: +e.target.value,
                                              },
                                              ...field.value.slice(
                                                videoIndex + 1
                                              ),
                                            ])
                                          }
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className="w-1/2">
                                {/* Video Order */}
                                <FormField
                                  name={`lectures.${lectureIndex}.videos.${videoIndex}.order`}
                                  control={control}
                                  render={({ field: orderField }) => (
                                    <FormItem>
                                      <FormLabel>Video Order</FormLabel>
                                      <FormControl>
                                        <Input
                                          className="bg-white dark:bg-slate-700"
                                          type="number"
                                          placeholder="Video Order"
                                          {...orderField}
                                          value={video.order}
                                          onChange={(e) =>
                                            field.onChange([
                                              ...field.value.slice(
                                                0,
                                                videoIndex
                                              ),
                                              {
                                                ...video,
                                                order: +e.target.value,
                                              },
                                              ...field.value.slice(
                                                videoIndex + 1
                                              ),
                                            ])
                                          }
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                            <div>
                              {/* Upload Video */}
                              <VideoUpload
                                lectureIndex={lectureIndex}
                                videoIndex={videoIndex}
                                control={control}
                                field={field}
                              />
                            </div>
                            <div className="ml-auto w-max">
                              <Button
                                size={"sm"}
                                variant={"destructive"}
                                type="button"
                                onClick={() =>
                                  field.onChange([
                                    ...field.value.slice(0, videoIndex),
                                    ...field.value.slice(videoIndex + 1),
                                  ])
                                }
                              >
                                <Trash />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}

                        <Button
                          size={"sm"}
                          className="bg-blue-600 hover:bg-blue-500 dark:text-white"
                          type="button"
                          onClick={() =>
                            field.onChange([
                              ...field.value,
                              {
                                title: "",
                                duration: 0,
                                order: field.value.length + 1,
                              },
                            ])
                          }
                        >
                          <PlusCircle />
                          Add Video
                        </Button>
                      </div>
                    )}
                  />
                </div>

                <Button
                  size="sm"
                  type="button"
                  variant={"destructive"}
                  onClick={() => removeLecture(lectureIndex)}
                >
                  <Trash />
                  Remove Lecture
                </Button>
              </div>
            ))}

            <Button
              size={"sm"}
              variant={"outline"}
              type="button"
              onClick={handleAddLecture}
              className="mt-2 dark:border-blue-400"
            >
              <Plus />
              Add Lecture
            </Button>
            <div className="ml-auto w-min " hidden={isUploading}>
              <Button
                className="bg-emerald-500 hover:bg-emerald-400 hover:scale-105 duration-300 transition-all"
                type="submit"
              >
                <CheckCheckIcon />
                Submit Course
              </Button>
            </div>
            {isUploading && (
              <div className="mt-4">
                <Progress value={progress} className="w-full" />
                <p className="mt-2 text-sm text-gray-700">
                  Uploading... {progress}%
                </p>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default LectureCreation;
