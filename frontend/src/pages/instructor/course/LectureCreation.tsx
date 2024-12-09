import React, { useState } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  FormProvider,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { CourseData, courseSchema } from "@/utils/lectureSchemaValidation";
import { LayoutDashboard, Plus, PlusCircle, Trash } from "lucide-react";
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

const LectureCreation: React.FC = () => {
  const methods = useForm<CourseData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      lectures: [
        {
          title: "",
          order: 1,
          description: "",
          videos: [
            {
              title: "",
              order: 1,
              duration: 0,
              file: null,
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
    register,
    handleSubmit,
    formState: { errors },
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
      videos: [],
    });
  };

  const onSubmit = async (data: CourseData) => {
    console.log(data);
    try {
      const formData = new FormData();
      data.lectures.forEach((lecture, lectureIndex) => {
        lecture.videos.forEach((video, videoIndex) => {
          if(video.file){
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
          )
        })
      })
      const courseId = "6756e0c35a428f31c4c8aa55"
      const response = await createCourseLectureApi (formData, courseId);
      //console.log(response)
      toast.success("Course and lectures added successfully!");
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-x-2">
          <div className="rounded-full bg-sky-200 p-1">
            <LayoutDashboard className="text-sky-800" />
          </div>
          <h2 className="text-xl font-semibold">Add Lectures to Course</h2>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {lectureFields.map((lecture, lectureIndex) => (
              <div
                key={lecture.id}
                className="space-y-4 border rounded-lg p-5 bg-slate-100 text-slate-800 "
              >
                <h2 className="text-lg font-bold text-slate-800 italic">
                  Lecture {lectureIndex + 1}
                </h2>
                <div>
                  <FormField
                    name={`lectures.${lectureIndex}.title`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lecture title</FormLabel>
                        <FormControl>
                          <Input placeholder="Lecture Title" className="bg-white" {...field} />
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
                          <Input placeholder="Lecture order" className="bg-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    name={`lectures.${lectureIndex}.description`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lecture description</FormLabel>
                        <FormControl>
                          <Textarea className="bg-white"
                            placeholder="e.g. 'This lecture includes'..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-slate-300 p-3 rounded-xl my-3">
                  <Controller
                    name={`lectures.${lectureIndex}.videos`}
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <div>
                        <h3 className="font-bold text-slate-600 pb-3 text-lg underline-offset-4 underline">
                          Videos
                        </h3>
                        {field.value.map((video, videoIndex) => (
                          <div
                            key={videoIndex}
                            style={{ marginBottom: "1rem" }}
                            className="p-3 space-y-3 bg-slate-200 rounded-xl"
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
                                        className="bg-white"
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

                            <div>
                              {/* Video Duration */}
                              <FormField
                                name={`lectures.${lectureIndex}.videos.${videoIndex}.duration`}
                                control={control}
                                render={({ field: durationField }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Video Duration (seconds)
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        className="bg-white"
                                        type="number"
                                        placeholder="Video Duration"
                                        {...durationField}
                                        value={video.duration}
                                        onChange={(e) =>
                                          field.onChange([
                                            ...field.value.slice(0, videoIndex),
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

                            <div>
                              {/* Video Order */}
                              <FormField
                                name={`lectures.${lectureIndex}.videos.${videoIndex}.order`}
                                control={control}
                                render={({ field: orderField }) => (
                                  <FormItem>
                                    <FormLabel>Video Order</FormLabel>
                                    <FormControl>
                                      <Input
                                        className="bg-white"
                                        type="number"
                                        placeholder="Video Order"
                                        {...orderField}
                                        value={video.order}
                                        onChange={(e) =>
                                          field.onChange([
                                            ...field.value.slice(0, videoIndex),
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
                            <div>
                              {/* Upload Video */}
                              <FormField
            name={`lectures.${lectureIndex}.videos.${videoIndex}.file`}
            control={control}
            rules={{
              required: "Please upload a file",
              validate: (file) =>
                file ? true : "File is required",
            }}
            render={({ field: fileField }) => (
              <FormItem>
                <FormLabel>Upload Video</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange([
                        ...field.value.slice(0, videoIndex),
                        { ...video, file },
                        ...field.value.slice(videoIndex + 1),
                      ]);
                      fileField.onChange(file); // Update validation state
                    }}
                  />
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
                          className="bg-blue-600 hover:bg-blue-500"
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
              variant={"outline"}
              type="button"
              onClick={handleAddLecture}
            >
              <Plus />
              Add Lecture
            </Button>
            <Button className="bg-blue-600" type="submit">
              Submit Course
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default LectureCreation;
