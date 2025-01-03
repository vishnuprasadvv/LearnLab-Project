import { getDashboardDataApi } from "@/api/adminApi";
import { IDashboardStatistics } from "@/types/adminDashboard";
import React, { useEffect, useState } from "react";
import SalesGraph from "./dashboard/SalesChart";
import TopSellingCourses from "./dashboard/TopSellingCourses";
import TopInstructors from "./dashboard/TopInstructors";

const Dashboard = () => {
  const [data, setData] = useState<IDashboardStatistics | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getDashboardDataApi();
        console.log(response);
        setData(response.data);
      } catch (error) {
        console.error("fetching dashboard data error", error);
      }
    };
    getData();
  }, []);
  return (
    <div className=" m-3 w-full">
      <div className="min-h-screen bg-gray-100 p-4">
        {/* <!-- Dashboard Header --> */}
        <header className="bg-white shadow-sm p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, Admin!</p>
        </header>

        {/* <!-- Main Content --> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* <!-- Statistics Cards --> */}
          <div className="bg-white shadow-sm rounded-lg p-6 col-span-1 lg:col-span-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* <!-- Card 1 --> */}
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-600">Total Students</p>
                <h3 className="text-2xl font-bold text-blue-800">
                  {data?.usersByRole.student}
                </h3>
              </div>
              {/* <!-- Card 2 --> */}
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <p className="text-sm text-green-600">Total Instructors</p>
                <h3 className="text-2xl font-bold text-green-800">
                  {data?.usersByRole.instructor}
                </h3>
              </div>
              {/* <!-- Card 3 --> */}
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <p className="text-sm text-purple-600">Courses Published</p>
                <h3 className="text-2xl font-bold text-purple-800">
                  {data?.publishedCourses}
                </h3>
              </div>
              {/* <!-- Card 4 --> */}
              <div className="bg-yellow-100 p-4 rounded-lg text-center">
                <p className="text-sm text-yellow-600">Total Revenue</p>
                <h3 className="text-2xl font-bold text-yellow-800">
                  ₹{data?.totalRevenue}
                </h3>
              </div>
              <div className="bg-pink-100 p-4 rounded-lg text-center">
                <p className="text-sm text-pink-600">Total Orders</p>
                <h3 className="text-2xl font-bold text-pink-800">
                  {data?.totalOrders}
                </h3>
              </div>
              <div className="bg-sky-100 p-4 rounded-lg text-center">
                <p className="text-sm text-sky-600">Active Users</p>
                <h3 className="text-2xl font-bold text-sky-800">
                  {data?.activeUsers}
                </h3>
              </div>
              <div className="bg-red-100 p-4 rounded-lg text-center">
                <p className="text-sm text-red-600">Inactive Users</p>
                <h3 className="text-2xl font-bold text-red-800">
                  {data?.inactiveUsers}
                </h3>
              </div>
              <div className="bg-emerald-100 p-4 rounded-lg text-center">
                <p className="text-sm text-emerald-600">Total Users</p>
                <h3 className="text-2xl font-bold text-emerald-800">
                  {data?.totalUsers}
                </h3>
              </div>
            </div>
          </div>

          {/* <!-- Notifications --> */}
          {/* <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Notifications</h2>
      <ul className="space-y-3">
        <li className="text-sm text-gray-700">New course "React Basics" was approved.</li>
        <li className="text-sm text-gray-700">Instructor John Doe has joined.</li>
        <li className="text-sm text-gray-700">Student Jane Smith enrolled in "JavaScript 101".</li>
      </ul>
    </div> */}
        </div>

        {/* <!-- Graph and Revenue Section --> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* <!-- Graph Section --> */}
  
          <div className="bg-white shadow-sm rounded-lg p-6">
          {data?.publishedCourses && (
                <SalesGraph revenueByMonth={data?.revenueByMonth} />
              )}
          </div>

          {/* <!-- Revenue Breakdown --> */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Revenue Breakdown
            </h2>
            <ul className="space-y-3">
              {data?.revenueByMonth.map((rev, index) => (
                <li
                  key={index}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>{rev.date}</span>
                  <span>{rev.orderCount}</span>
                  <span>₹{rev.revenue}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6">
              <TopSellingCourses />
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6">
              <TopInstructors />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
