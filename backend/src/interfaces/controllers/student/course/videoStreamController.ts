import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { CourseRepositoryClass } from "../../../../infrastructure/repositories/courseRepository";
import { GetSecureVideoUrlService } from "../../../../application/use-cases/student/videoStreamService";

const courseRepository = new CourseRepositoryClass();
const getSecureVideoUrlService = new GetSecureVideoUrlService(courseRepository);
export const streamVideoController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseId, videoId } = req.params;
    if (!courseId) throw new CustomError("Course ID not found", 400);
    if (!videoId) throw new CustomError("Video ID not found", 400);
    const secureVideoUrl = await getSecureVideoUrlService.execute(
      courseId,
      videoId
    );
    if (!secureVideoUrl)
      throw new CustomError("Video secure URL not found", 404);

   // res.status(200).json({success:true, url: secureVideoUrl})
res.redirect(secureVideoUrl)
    // const range = req.headers.range;
    // console.log("Range header received:", range);
    // if (!range) {
    //   res.status(400).send("Required range header");
    //   console.log("range is required");
    //   return;
    // }

    // // Fetch the video stream from Cloudinary
    // try {
    //   const response = await axios.get(secureVideoUrl, {
    //     responseType: "stream",
    //   });
    //   const videoSize = parseInt(response.headers["content-length"], 10);
    //   //const CHUNK_SIZE = 10 ** 6; // 1MB chunks
    //   const CHUNK_SIZE = 256 * 1024;

    //   // Extract the start and end byte positions from the range header
    //   const [startByte, endByte] = range.replace(/bytes=/, "").split("-");

    //   let start = parseInt(startByte, 10);
    //   let end = endByte ? parseInt(endByte, 10) : start + CHUNK_SIZE - 1;

    //   // Ensure the 'end' byte doesn't exceed the video size
    //   end = Math.min(end, videoSize - 1);

    //   const contentLength = end - start + 1;
    //   console.log("start", start);
    //   console.log("end", end);
    //   console.log("videosize", videoSize);
    //   console.log("contentlength", contentLength);
    //   //Set headers for streaming
    //   res.writeHead(206, {
    //     "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    //     "Accept-Ranges": "bytes",
    //     "Content-Length": contentLength,
    //     "Content-Type": response.headers["content-type"],
    //     "Access-Control-Allow-Origin": config.cors.CLIENT_URL,
    //     "Access-Control-Allow-Credentials": "true",
    //   });

    //   //Pipe the video data to the response with the range sliced
    //   response.data.pipe(res).on("error", (err: any) => {
    //     console.error("Error streaming video:", err);
    //     res.status(500).send("Error streaming video");
    //   });
    // } catch (error) {
    //   console.error("Error fetching video from Cloudinary:", error);
    //   res.status(500).send("Error fetching video from Cloudinary");
    // }

    console.log('stream controller', secureVideoUrl)
  } catch (error) {
    next(error);
  }
};
