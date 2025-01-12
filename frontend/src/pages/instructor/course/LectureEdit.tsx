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
import { editCourseLectureApi, getCourseById } from "@/api/instructorApi";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosProgressEvent } from "axios";
import { Progress } from "@/components/ui/progress";
import { ICourses } from "@/types/course";
import _ from "lodash";
import CustomToggleButton from "@/components/common/ToggleButton/ToggleButton";
import LoadingScreen from "@/components/common/Loading/LoadingScreen";

const LectureEdit: React.FC = () => {
  const { courseId } = useParams();
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const [course, setCourse] = useState<ICourses | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});

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

  const { control, handleSubmit, reset } = methods;

  const {
    fields: lectureFields,
    append: addLecture,
    remove: removeLecture,
  } = useFieldArray({
    control,
    name: "lectures",
  });

  useEffect(() => {
    const getCourse = async () => {
      if (!courseId) {
        throw new Error("Course id not found");
      }
      try {
        setLoading(true);
        const response = await getCourseById(courseId);
        const courseData = response.data;

        const formattedData: CourseData = {
          lectures: (courseData.lectures || []).map(
            (lecture: any, lectureIndex: number) => ({
              title: lecture.title || "",
              description: lecture.description || "",
              isFree: lecture.isFree || false,
              order: lecture.order || lectureIndex + 1,
              videos: (lecture.videos || []).map(
                (video: any, videoIndex: number) => ({
                  title: video.title || "",
                  order: video.order || videoIndex + 1,
                  duration: video.duration || 0,
                  file: video.url || "",
                })
              ),
            })
          ),
        };

        reset(formattedData);
        setInitialFormData(formattedData);
        setCourse(courseData);
      } catch (error: any) {
        toast.error(error.message || "failed to fetch course");
        navigate("/instructor/courses");
      } finally {
        setLoading(false);
      }
    };

    getCourse();
  }, [courseId, reset]);

  const handleAddLecture = () => {
    addLecture({
      title: "",
      order: lectureFields.length + 1,
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
    });
  };

  const onSubmit = async (data: CourseData) => {
    if (isUploading) {
      toast.error("An upload is already in progress.");
      return;
    }
    const isUnchanged = _.isEqual(data, initialFormData);
    if (isUnchanged) {
      toast("No Changes detected", { icon: "⚠️" });
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
          lecture.isFree ? "true" : "false"
        );
        formData.append(
          `lectures[${lectureIndex}].order`,
          lecture.order.toString()
        );
      });

      toast.loading("Uploading lectures...");

      const response = await editCourseLectureApi(
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
      toast.success(response.message || "Course edited successfully!");
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

  const [videoPreviews, setVideoPreviews] = useState<Record<string, string>>(
    {}
  );

  return (
    <div className="container mx-auto px-4 md:px-10 py-8 w-full">
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2">
            <div className="rounded-full bg-sky-200 p-1">
              <LayoutDashboard className="text-sky-800" />
            </div>
            <h2 className="text-xl font-semibold">Edit course lectures</h2>
          </div>
          <div className="mt-3 ml-5">
            <span className="italic">Course title : </span>
            <span className="text-lg italic font-semibold text-slate-800 dark:text-gray-100">
              {course?.title || "Course title"}
            </span>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {lectureFields.map((lecture, lectureIndex) => (
                <div
                  key={lecture.id}
                  className="space-y-4 border rounded-lg p-5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-gray-100 mt-2"
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
                                placeholder="Lecture order"
                                type="number"
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
                                              ...field.value.slice(
                                                0,
                                                videoIndex
                                              ),
                                              {
                                                ...video,
                                                title: e.target.value,
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
                                            type="number"
                                            className="bg-white dark:bg-slate-700"
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
                                <FormField
                                  name={`lectures.${lectureIndex}.videos.${videoIndex}.file`}
                                  control={control}
                                  rules={{
                                    required: "Please upload a file",
                                    validate: (file) =>
                                      file || typeof video.file === "string"
                                        ? true
                                        : "File is required",
                                  }}
                                  render={({ field: fileField }) => (
                                    <FormItem>
                                      <FormLabel>Upload Video</FormLabel>
                                      <FormControl>
                                        <div className="space-y-2">
                                          {/* Show existing video URL if available */}
                                          {video.file &&
                                          typeof video.file === "string" ? (
                                            <div className="bg-gray-100 dark:bg-slate-800  p-2 rounded-md">
                                              <div className="text-sm text-gray-700 dark:text-gray-100">
                                                <h3 className="pb-1">
                                                  Current Video:
                                                </h3>
                                                <video controls width="300">
                                                  <source src={video.file} />
                                                </video>
                                              </div>
                                              <p className="text-xs text-gray-500 dark:text-gray-100 mt-2 uppercase">
                                                (Don't choose any video file to
                                                retain the current video)
                                              </p>
                                            </div>
                                          ) : null}

                                          {/* Show preview of newly selected video */}
                                          {videoPreviews[
                                            `${lectureIndex}-${videoIndex}`
                                          ] && (
                                            <div className="bg-gray-100 dark:bg-slate-800 p-2 rounded-md">
                                              <h2 className="pb-1">
                                                Newly chosen video:
                                              </h2>
                                              <video
                                                controls
                                                width="300"
                                                key={
                                                  videoPreviews[
                                                    `${lectureIndex}-${videoIndex}`
                                                  ]
                                                }
                                              >
                                                <source
                                                  src={
                                                    videoPreviews[
                                                      `${lectureIndex}-${videoIndex}`
                                                    ]
                                                  }
                                                />
                                              </video>
                                            </div>
                                          )}

                                          {/* File input to upload a new video */}
                                          <Input
                                            className="bg-white dark:bg-slate-700"
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => {
                                              const selectedFile =
                                                e.target.files?.[0];
                                              const previewKey = `${lectureIndex}-${videoIndex}`;

                                              // Revoke the previous preview URL to avoid memory leaks
                                              if (videoPreviews[previewKey]) {
                                                URL.revokeObjectURL(
                                                  videoPreviews[previewKey]
                                                );
                                              }

                                              if (selectedFile) {
                                                const newPreviewUrl =
                                                  URL.createObjectURL(
                                                    selectedFile
                                                  );

                                                // Update the video previews state
                                                setVideoPreviews((prev) => ({
                                                  ...prev,
                                                  [previewKey]: newPreviewUrl,
                                                }));

                                                // Update the video field in the form
                                                field.onChange([
                                                  ...field.value.slice(
                                                    0,
                                                    videoIndex
                                                  ),
                                                  {
                                                    ...video,
                                                    file: selectedFile,
                                                  },
                                                  ...field.value.slice(
                                                    videoIndex + 1
                                                  ),
                                                ]);
                                                fileField.onChange(
                                                  selectedFile
                                                ); // Update validation state
                                              } else {
                                                // Retain the existing video file if no new file is selected
                                                field.onChange([
                                                  ...field.value.slice(
                                                    0,
                                                    videoIndex
                                                  ),
                                                  {
                                                    ...video,
                                                    file: video.file,
                                                  },
                                                  ...field.value.slice(
                                                    videoIndex + 1
                                                  ),
                                                ]);
                                                fileField.onChange(null); // Clear file state if necessary
                                              }
                                            }}
                                          />
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
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
      )}
    </div>
  );
};

export default LectureEdit;
