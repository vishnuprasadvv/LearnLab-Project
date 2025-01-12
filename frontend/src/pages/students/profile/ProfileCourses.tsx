import { fetchMyCoursesApi } from "@/api/student";
import UserProfileCourses from "@/components/common/Course/userProfileOrders";
import PaginationComponent from "@/components/common/Pagination/Pagination";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { COURSES_PER_PAGE } from "@/config/paginationConifig";
import { IOrder } from "@/types/orders";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProfileCourses = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [myOrders, setMyOrders] = useState<IOrder[] | []>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = COURSES_PER_PAGE;
  const [limitedOrders, setLimitedOrders] = useState<IOrder[] | []>([]);
  useEffect(() => {
    setIsLoading(true);
    const fetchMyCourses = async () => {
      try {
        const response = await fetchMyCoursesApi();
        setMyOrders(response.data);
        //calculate total pages
        const totalItems = response.data.length;
        setTotalPages(Math.ceil(totalItems / itemsPerPage));
      } catch (error: any) {
        toast.error(error.message || "Fetching course failed");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  useEffect(() => {
    //set limited items
    setLimitedOrders(
      myOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    );
  }, [currentPage, myOrders]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-1">
        <Card className="w-full min-h-[80vh]">
          <CardHeader className="text-center">
            <div className="text-xl">My Learning</div>
          </CardHeader>
          <CardContent>
            <div className="">
              {myOrders.length === 0 ? (
                <h2 className="text-lg text-center text-slate-600 font-semibold">
                  You are not enrolled any courses
                </h2>
              ) : (
                <div className="space-y-2">
                  {isLoading
                    ? Array.from({ length: 8 }).map((_, index) => (
                        <ProfileCoursesSkeleton key={index} />
                      ))
                    : limitedOrders.map((order, index) => (
                        <div
                          className="hover:bg-blue-50 p-1 rounded-md bg-slate-50 dark:bg-slate-800 dark:hover-bg-slate-700 shadow-md"
                          key={index}
                        >
                          <h3 className="font-semibold">
                            {order.orderId || "OrderID"}
                          </h3>
                          {order.courses.map((course, index) => (
                            <UserProfileCourses {...course} key={index} />
                          ))}
                          <div className="flex flex-col">
                            <div>
                              <span>Payment status : </span>
                              <span
                                className={`uppercase ${
                                  order.paymentStatus == "pending"
                                    ? "text-yellow-400"
                                    : order.paymentStatus === "failed"
                                    ? "text-red-500"
                                    : "text-green-400"
                                }`}
                              >
                                {order.paymentStatus}
                              </span>
                            </div>
                            <div>
                              <span>Total amount : </span>
                              <span className="font-medium">
                                ₹ {order.totalAmount}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              )}
            </div>
            {totalPages > 0 && (
              <div className="pt-5 mt-auto">
                <PaginationComponent
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileCourses;

export function ProfileCoursesSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
