import { getInstructorPurchsesApi } from "@/api/instructorApi";
import ResultsNotFound from "@/components/common/NoResults/ResultsNotFound";
import { IOrder } from "@/types/orders";
import React, { useEffect, useState } from "react";

const InstructorPurchases: React.FC = () => {
  //search and pagination
  const [totalCourses, setTotalCourses] = useState("");
  const [purchases, setPurchases] = useState<IOrder[] | []>([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getInstructorPurchsesApi();
        setPurchases(response.data);
        setTotalCourses(response.data.length || 0);
      } catch (error) {
        console.error("order fetching error", error);
      }
    };
    fetchOrders();
  }, []);
  return (
    <div className="container mx-auto md:px-4 px-2 py-8 w-full flex flex-col">
      <div className="">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-dark-500 text-center ">
            {" "}
            Purchases
          </h2>

          {/* Search bar */}
          <div className="flex lg:flex-row flex-col justify-between gap-2 max-w-full">
            {/* <div className=" relative lg:w-1/2 w-full flex">
            <IoSearchOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 place-content-center justify-center text-lg" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border w-full border-blue-100 place-self-center
              rounded-full h-10 shadow-md shadow-blue-100"
            />
          </div> */}
            <div className="flex">
              {/* <CourseFilter onFilterChange={handleFilterChange} /> */}
            </div>
          </div>
          <div className="font-medium pt-2">TOTAL : {totalCourses} no/s</div>

          {purchases.length !== 0 ? (
            <div className=" bg-blue-100 overflow-auto mt-2">
              <table className="text-sm text-left w-full rtl:text-right text-gray-500 dark:text-gray-400 overflow-x-scroll">
                <thead className=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr className="bg-blue-200 dark:bg-blue-600 dark:text-gray-100">
                    <th scope="col" className="lg:px-6 px-1 py-4">
                      Title
                    </th>
                    <th scope="col" className="lg:px-6 px-1 py-4">
                      User
                    </th>
                    <th scope="col" className="lg:px-6 px-1 py-4">
                      Instructor
                    </th>
                    <th scope="col" className="lg:px-6 px-1 py-4">
                      Ordered at
                    </th>
                    <th scope="col" className="lg:px-6 px-1 py-4">
                      price
                    </th>
                    <th scope="col" className="lg:px-6 px-1 py-4">
                      payment
                    </th>
                    <th
                      scope="col"
                      className="lg:px-6 px-1 py-4 hidden lg:block"
                    >
                      type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {purchases?.map((order) => (
                    <tr
                      key={order._id}
                      className="odd:bg-white  odd:dark:bg-gray-900 hover:bg-gray-100 even:bg-gray-50
             even:dark:bg-gray-800 border-b dark:border-gray-700 dark:hover:bg-slate-700"
                    >
                      <td
                        scope="row"
                        className=" lg:px-6 px-1 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {order.courses.flatMap((course) => course.courseTitle)}
                      </td>
                      <td className="lg:px-6 px-1 py-4">
                        {" "}
                        {`${order.userId.firstName} ${order.userId.lastName}`}
                      </td>
                      <td className="lg:px-6 px-1 py-4">
                        {" "}
                        {order.courses.flatMap(
                          (course) => course.courseInstructor
                        )}
                      </td>
                      <td className="lg:px-6 px-1 py-4">
                        {(order.paymentDate &&
                          new Date(order.paymentDate).toDateString()) ||
                          "NA"}
                      </td>
                      <td className="lg:px-6 px-1 py-4">
                        <div>₹ {order.totalAmount}</div>
                      </td>
                      <td className="lg:px-6 px-1 py-4">
                        <div
                          className={`uppercase text-xs text-white text-center rounded-full px-1 py-1 ${
                            order.paymentStatus == "completed"
                              ? "bg-green-500"
                              : order.paymentStatus == "pending"
                              ? "bg-yellow-400"
                              : "bg-red-500"
                          }`}
                        >
                          {order.paymentStatus}
                        </div>
                      </td>
                      <td className="lg:px-6 px-1 py-4 hidden lg:block">
                        <div>{order.paymentType}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <ResultsNotFound />
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorPurchases;
