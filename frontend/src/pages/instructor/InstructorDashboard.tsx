import { useAppSelector } from "@/app/hooks";
import { LiaBookReaderSolid } from "react-icons/lia";
import { RxDashboard } from "react-icons/rx";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { RiArrowGoBackLine } from "react-icons/ri";
import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { ShoppingCart } from "lucide-react";

const InstructorDashboard = () => {
  const profileItems = [
    { path: "dashboard", name: "Dashboard", icon: <RxDashboard /> },
    { path: "courses", name: "My courses", icon: <LiaBookReaderSolid /> },
    
    {
      path: "purchases",
      name: "Purchase Management",
      icon: <ShoppingCart />,
    },
  ];

  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar visibility


  return (
    <div className="flex flex-col min-h-screen">
      {/* Toggle Sidebar Button */}
      <div className="bg-white dark:bg-slate-900 w-full sm:hidden fixed z-10 h-[10vh] backdrop-blur-md bg-opacity-75">
        <button
          className="p-3 hover:bg-blue-400 hover:text-white bg-blue-200 dark:bg-blue-600 dark:hover:bg-blue-500 hover:scale-105 duration-300 rounded-full mt-4 ml-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <IoIosArrowBack className="text-xl" />
          ) : (
            <IoIosArrowForward className="text-xl" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        } sm:block flex flex-col gap-1 space-y-2 border mt-[10vh] sm:mt-0 p-3 bg-slate-50 dark:bg-slate-700 w-full sm:w-[15%] md:w-[20%]  h-auto sm:h-[90%] 
        fixed z-10 overflow-y-auto  transition-transform duration-300 shadow-lg ease-in-out will-change-transform`}
      >
        <div className="text-center sm:text-start sm:hidden md:block uppercase font-bold text-gray-600 dark:text-gray-100 text-xl">
          INSTRUCTOR DASHBOARD
        </div>

        <div className="flex gap-3 justify-center md:justify-start mb-2 font-bold bg-slate-200 dark:bg-slate-400 dark:outline-slate-300 outline outline-slate-400 rounded-md p-2 py-5 w-full">
          <LiaChalkboardTeacherSolid className="text-2xl" />
          <span className="sm:hidden md:block">
            Hi, {`${user?.firstName} ${user?.lastName}`}
          </span>
        </div>

        {profileItems.map((tab, index) => (
          <NavLink
            to={tab.path}
            key={index}
            className={({ isActive }) =>
              `${
                isActive ? "bg-blue-300 dark:bg-blue-500" : "hover:bg-gray-200 dark:hover:bg-slate-600"
              } flex gap-3 items-center justify-center md:justify-start  rounded-md p-2 py-5 w-full`
            }
            onClick={() => setIsSidebarOpen(false)} // Close sidebar when a menu item is clicked
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="block sm:hidden md:block truncate">
              {tab.name}
            </span>
          </NavLink>
        ))}

        <button
          className="flex gap-3 items-center justify-center md:justify-start hover:bg-red-200 dark:hover:bg-red-400 rounded-md p-2 py-5 w-full mt-auto"
          onClick={() => navigate("/profile/dashboard")}
        >
          <RiArrowGoBackLine className="text-2xl" />
          <span className="sm:hidden md:block">Back to profile</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-grow sm:ml-[15%] md:ml-[20%] p-2 mt-10 sm:mt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default InstructorDashboard;
