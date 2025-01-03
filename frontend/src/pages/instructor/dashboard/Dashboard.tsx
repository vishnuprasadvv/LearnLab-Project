import { getDashboardDataApi } from "@/api/adminApi";
import { getDashboardMetricsApi } from "@/api/instructorApi";
import { IDashboardStatistics } from "@/types/adminDashboard";
import { IInstructorDashboardMetrics } from "@/types/instructor";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import SalesChartInstructor from "./SalesChart";

const Dashboard = () => {
  const [data, setData] = useState<IInstructorDashboardMetrics| null>(null)
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Earnings",
        data: [500, 800, 650, 900, 1200, 1100, 1500],
        borderColor: "#4A90E2",
        backgroundColor: "rgba(74, 144, 226, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  useEffect(() => {
    const getData = async () => {
      try { 
        const response = await getDashboardMetricsApi()
        console.log(response)
        setData(response.data)
      } catch (error) {
        console.error("fetching dashboard data error", error);
      }
    };
    getData();
  }, []);

  return (
    <main className="flex-1 p-6">
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
    </header>

    {/* Metrics Section */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white shadow p-4 rounded">
        <h3 className="text-lg font-semibold">Total Students</h3>
        <p className="text-2xl font-bold">{data?.totalStudents || 'NA'}</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h3 className="text-lg font-semibold">Courses</h3>
        <p className="text-2xl font-bold">{data?.totalCourses || 'NA'}</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h3 className="text-lg font-semibold">Earnings</h3>
        <p className="text-2xl font-bold">₹ {data?.totalEarnings || 0}</p>
      </div>
    </div>

     {/* Graph Section */}
     <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Earnings Overview</h2>
            <div className="bg-white shadow p-4 rounded">
             <SalesChartInstructor/>
            </div>
          </div>

    {/* Recent Activities Section */}
    {/* <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
      <div className="bg-white shadow p-4 rounded">
        <ul>
          <li className="flex justify-between items-center py-2 border-b">
            <span>Student John Doe enrolled in React Course</span>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </li>
          <li className="flex justify-between items-center py-2 border-b">
            <span>New message from Jane Smith</span>
            <span className="text-sm text-gray-500">4 hours ago</span>
          </li>
          <li className="flex justify-between items-center py-2">
            <span>React Course updated successfully</span>
            <span className="text-sm text-gray-500">1 day ago</span>
          </li>
        </ul>
      </div>
    </div> */}
  </main>
  );
};

export default Dashboard;
