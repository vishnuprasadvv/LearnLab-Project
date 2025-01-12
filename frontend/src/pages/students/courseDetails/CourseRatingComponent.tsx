import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import profileimg from "../../../assets/chat/private-chat-avatar-612x612.jpg";
import {
  deleteRatingApi,
  getCourseRatingsApi,
  submitRatingApi,
  updateRatingApi,
} from "@/api/student";
import { z } from "zod";
import toast from "react-hot-toast";
import { ICourseRating } from "@/types/rating";
import { useAppSelector } from "@/app/hooks";
import { SquarePen, Trash2 } from "lucide-react";
import { ICourses } from "@/types/course";

const ratingSchema = z.object({
  rating: z
    .number()
    .min(0.5, "Rating must be atleast 0.5")
    .max(5, "Rating cannot exceed 5"),
  review: z
    .string()
    .min(1, "Add your feedback.")
    .max(500, "Max 500 characters"),
});

const CourseRatingComponent: React.FC<{
  courseId: string;
  purchased: boolean;
  setCourse:(course:ICourses) => void;
  course : ICourses;
}> = ({ courseId, purchased,setCourse , course}) => {
  const [courseRatings, setCourseRatings] = useState<ICourseRating[] | []>([]);
  const [rating, setRating] = useState<number | null>(0);
  const [review, setReview] = useState<string>("");
  const user = useAppSelector((state) => state.auth.user);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editRatingId, setEditRatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await getCourseRatingsApi(courseId);
        setCourseRatings(response.data);
      } catch (error) {
        console.error("error fetching ratings", error);
      }
    };
    fetchRatings();
  }, [courseId]);

  const handleSubmit = async () => {
    try {
      const parsedData = ratingSchema.parse({
        rating,
        review,
      });

      //for updating course average rating 
      let currentAvgRating = course.averageRating;
      let totalRatingCount = course.ratingsCount;
      let updatedAvgRating;
      //for edit
      if (editMode && editRatingId) {

        let previousRatingData = courseRatings.filter((rating)=> rating._id === editRatingId)
        //update review
        await updateRatingApi({
          ratingId: editRatingId,
          ...parsedData,
        });
        setCourseRatings((prev) =>
          prev.map((item) =>
            item._id === editRatingId ? { ...item, ...parsedData } : item
          )
        );
        toast.success("Review updated successfully");

        //update rating after update rating
        if(totalRatingCount === 1) {
          updatedAvgRating = parsedData.rating
        }else{
          updatedAvgRating = (currentAvgRating * totalRatingCount - previousRatingData[0].rating + parsedData.rating)/ totalRatingCount;
        }

      } else {
        //Add new review
        const response = await submitRatingApi({ courseId, ...parsedData });
        toast.success("Rating submitted successfully");
        setCourseRatings((prev) => [...prev, response.data]);

        //update avg rating after new rating
        updatedAvgRating = (currentAvgRating * totalRatingCount + parsedData.rating) / (totalRatingCount + 1);
        updatedAvgRating = Math.round(updatedAvgRating * 100)/ 100;
        totalRatingCount += 1; //add rating count
      }

      setCourse({
        ...course,
        averageRating : updatedAvgRating,
        ratingsCount : totalRatingCount
      })
      setRating(null);
      setReview("");
      setEditMode(false);
      setEditRatingId(null);
    } catch (error: any) {
      console.error("Rating submitting error", error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0]?.message || "Invalid input");
      } else {
        toast.error(error.response.data.message || "Failed to submit rating.");
      }
    }
  };
  const handleEdit = (rating: ICourseRating) => {
    setEditMode(true);
    setEditRatingId(rating._id || null);
    setRating(rating.rating);
    setReview(rating.review || "");
  };

  const handleDelete = async(ratingId: string) => {
    try {
       await deleteRatingApi(ratingId)
      setCourseRatings((prev) => prev.filter((rating) => rating._id !== ratingId))
      toast.success('Your rating removed successfully')
      //change rating 
      let previousRatingData = courseRatings.filter((rating) => rating._id === ratingId)
      let currentAvgRating = course.averageRating;
      let totalRatingCount = course.ratingsCount;
      let updatedRating ;
      totalRatingCount -= 1;
      if(totalRatingCount > 0) {
        updatedRating = (currentAvgRating * (totalRatingCount + 1) - previousRatingData[0].rating) / totalRatingCount;
      }else{
        updatedRating = 0;
      }
      //update course 
      setCourse({
        ...course,
        averageRating: updatedRating,
        ratingsCount : totalRatingCount
      })
    } catch (error:any) {
      console.error("Error deleting rating:", error);
      toast.error(error.response.data.message || 'Failed to remove your rating')
    }
  }
  return (
    <div className="w-full space-y-5">
      <h1 className="font-bold text-xl md:text-2xl">Ratings</h1>
      <div className="border rounded-lg p-3 shadow-md">
        {/* Give rating or edit rating */}
        {purchased && user?._id !== course.instructor._id && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <img
                className="rounded-full h-max"
                src={user?.profileImageUrl || profileimg}
                alt="profilepic"
                width={50}
                height={50}
              />
              <div>
                <h3 className="pt-2 font-semibold">
                  {editMode ? "Edit rating" : "Give rating"}{" "}
                  <span className="text-red-500">*</span>
                </h3>
                <Rating
                  size="small"
                  defaultValue={0}
                  value={rating}
                  precision={0.5}
                  onChange={(_, newValue) => setRating(newValue)}
                  sx={{
                    "& .MuiRating-iconEmpty": {
                      color: "rgba(128, 128, 128, 1)", // Dark mode and light mode colors
                    },
                  }}
                />
              </div>
            </div>
            <Textarea
              className="ml-10 w-auto"
              cols={50}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review here..."
            />
            <div className="flex justify-end gap-3">
              {editMode && (
                <Button
                  className="rounded-full bg-gray-500"
                  onClick={() => {
                    setEditMode(false);
                    setEditRatingId(null);
                    setRating(null);
                    setReview("");
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                className="w-max place-self-end rounded-full bg-blue-600"
                onClick={handleSubmit}
              >
                {editMode ? "Update" : "Submit"}
              </Button>
            </div>
            <Separator className="bg-slate-300" />
          </div>
        )}

{/* Display ratings section */}
{
  courseRatings.length > 0 ? (

    <div className="flex  flex-col">

    {courseRatings.sort((a,b) => {
      if(a.userId._id === user?._id) return -1;
      if(b.userId._id === user?._id) return 1;
      return 0;
    })
    .map((rating, index) => (
      <div key={index} className="flex flex-col mb-4 ">
        <div className="flex justify-between px-2">
          <div className="flex gap-3">
            <img
              className="rounded-full h-max"
              src={rating.userId.profileImageUrl || profileimg}
              alt="profilepic"
              width={50}
              height={50}
            />
            <div>
              <h3 className="pt-2 font-light text-xs">{`${rating.userId.firstName} ${rating.userId.lastName}`}</h3>
              <Rating
                size="small"
                value={rating.rating || 0}
                precision={0.5}
                readOnly
              />
            </div>
          </div>
          {user && user._id === rating.userId._id && (
            <div className="flex gap-2">
              <div
                className="flex items-center justify-center text-slate-800 dark:text-white hover:text-blue-500 duration-300 transition-colors"
              >
                <SquarePen size={20} onClick={() => handleEdit(rating)}/>
              </div>
              <div
                className="flex items-center justify-center text-slate-800 dark:text-white hover:text-red-500 duration-300 transition-colors"
              >
                <Trash2 size={20}  onClick={() => rating._id && handleDelete(rating._id)} />
              </div>
            </div>
          )}
        </div>
        <p className="ml-16">{rating.review || ""}</p>
        <p className="text-xs text-gray-500 place-self-end">
          {new Date(rating.updatedAt).toDateString()}{" "}
          {new Date(rating.updatedAt).toLocaleTimeString()}
        </p>
        <Separator className="bg-slate-300 mt-2" />
      </div>
    ))}
  </div>

  ) : (
    <div>
      <h1 className="text-xl text-gray-500 dark:text-gray-400 text-center font-bold">No Ratings</h1>
    </div>
  )
}
        
      </div>
    </div>
  );
};

export default CourseRatingComponent;
