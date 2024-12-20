import { z } from "zod";

export const lectureSchema = z.object({
  title: z.string().min(1, { message: "Lecture title is required." }),
  order:z.number().min(1, { message: "Video order must be greater than 0." }),
description:z.string().min(10, {message: 'Description must be more than 10 characters'}),
isFree:z.boolean().default(false),
  videos: z
    .array(
      z.object({
        title: z.string().min(1, { message: "Video title is required." }),
        duration: z.number().min(1, { message: "Video duration must be greater than 0." }),
        order: z.number().min(1, { message: "Video order must be greater than 0." }),
        file:z 
          .union([
            z.instanceof(File).refine((file) => file?.size > 0, { message: "File is required." }), // for file uploads
            z.string().url({ message: "Invalid URL" }).optional(), // for video URL
          ])
          .optional(), // This makes `file` optional, as users can choose to provide either a file or a URL
      })
    )
    .min(1, { message: "At least one video is required per lecture." }),
});

export const courseSchema = z.object({
  lectures: z.array(lectureSchema).nonempty({ message: "At least one lecture is required." }),
});

export type CourseData = z.infer<typeof courseSchema>;
