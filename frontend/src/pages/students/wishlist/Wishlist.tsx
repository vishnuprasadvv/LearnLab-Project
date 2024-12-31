import { getWishlistApi, removeFromWishlistApi } from "@/api/student";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import WishlistCourseList from "@/components/common/Course/WishlistCourseList";
import { endLoading, startLoading } from "@/features/authSlice";
import { IPopulatedWishlist } from "@/types/wishlist";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Emptywishlisticon from "../../../assets/wishlist/empty-wishlist.jpg";
import BreadCrumb from "@/components/common/BreadCrumb/BreadCrumb";
import LoadingScreen from "@/components/common/Loading/LoadingScreen";

const Wishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState<IPopulatedWishlist[] | []>([]);
  const { loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        dispatch(startLoading());
        const response = await getWishlistApi();
        setWishlist(response.data);
      } catch (error: any) {
        toast.error(error.response.data.message || "Something went wrong");
        console.error("fetching wishlist failed", error);
      } finally {
        dispatch(endLoading());
      }
    };
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (courseId: string) => {
    try {
      const response = await removeFromWishlistApi(courseId);
      toast.success(response.message || "Course removed from wishlist");
      setWishlist((prev) =>
        prev.filter((item) => item.courseId._id !== courseId)
      );
    } catch (error: any) {
      console.error("remove from wishlist error", error);
      toast.error(
        error.response.data.message || "Error removing from wishlist"
      );
    }
  };
  return (
    <div className="pt-2 flex items-center justify-center">
      <div className="max-w-7xl w-full">
        <h1 className="text-2xl font-bold text-center ">Wishlist</h1>
        <BreadCrumb />
        <div className="p-2 w-full">
          {loading ? (
            <LoadingScreen/>
          ) : wishlist.length > 0 ? (
            wishlist.map((item, index) => (
              <div className="flex justify-between" key={index}>
                <WishlistCourseList
                  item={item}
                  handleRemoveFromWishlist={handleRemoveFromWishlist}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center min-h-32 dark:bg-gray-900 p-6">
              <img src={Emptywishlisticon} width={250} height={250} />
              <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
                Oops...!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Currently your wishlist is empty.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
