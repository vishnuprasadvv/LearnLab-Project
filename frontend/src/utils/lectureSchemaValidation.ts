import { z } from "zod";

export const lectureSchema = z.object({
  title: z.string().min(1, { message: "Lecture title is required." }),
  order:z.number().min(1, { message: "Video order must be greater than 0." }),
description:z.string().min(10, {message: 'Description must be more than 10 characters'}),
  videos: z
    .array(
      z.object({
        title: z.string().min(1, { message: "Video title is required." }),
        duration: z.number().min(1, { message: "Video duration must be greater than 0." }),
        order: z.number().min(1, { message: "Video order must be greater than 0." }),
        file: z
        .any()
        .refine((file) => file?.size > 0, { message: "Video is required." })
        .refine((file) => file instanceof File || file === undefined, {
          message: "Invalid file type for video.",
        }),
      })
    )
    .min(1, { message: "At least one video is required per lecture." }),
});

export const courseSchema = z.object({
  lectures: z.array(lectureSchema).nonempty({ message: "At least one lecture is required." }),
});

export type CourseData = z.infer<typeof courseSchema>;
