import { NavLink, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
import { LiaBookReaderSolid, LiaChalkboardTeacherSolid } from "react-icons/lia";
import { RxDashboard } from "react-icons/rx";
import toast from "react-hot-toast";
import { HiOutlineUsers } from "react-icons/hi2";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IoLogOutOutline } from "react-icons/io5";
import { MdOutlineCategory } from "react-icons/md";
import { adminLogout } from "@/api/adminApi";
import { adminLogoutSliceAction } from "@/features/adminSlice";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

const AdminPage = () => {
  const profileItems = [
    {
      path: "dashboard",
      name: "Dashboard",
      icon: <RxDashboard />,
    },
    {
      path: "users",
      name: "User Management",
      icon: <HiOutlineUsers />,
    },
    {
      path: "instructors",
      name: "Instructor Management",
      icon: <LiaChalkboardTeacherSolid />,
    },
    {
      path: "courses",
      name: "Course Management",
      icon: <LiaBookReaderSolid />,
    },
    {
      path: "purchases",
      name: "Purchase Management",
      icon: <ShoppingCart />,
    },
    {
      path: "categories",
      name: "Category Management",
      icon: <MdOutlineCategory />,
    },
  ];

  const { user } = useAppSelector((state) => state.admin);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      const response: any = await adminLogout();
      dispatch(adminLogoutSliceAction());
      toast.success(response.message || "Logout successful");
    } catch (err: any) {
      toast.error(err.message || "Logout failed");
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white w-full sm:hidden fixed z-10 h-[10vh] backdrop-blur-md bg-opacity-75">
        <button
          className="p-3 hover:bg-blue-400 hover:text-white bg-blue-200 hover:scale-105 duration-300 rounded-full mt-4 ml-4"
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
        } sm:block flex flex-col gap-1 space-y-2 border mt-[10vh] sm:mt-0 p-3 bg-slate-50 w-full sm:w-[15%] md:w-[20%] h-full 
        fixed z-10 overflow-y-auto  transition-transform duration-300 shadow-lg ease-in-out will-change-transform `}
      >
        <div className="text-center sm:text-start sm:hidden md:block uppercase font-bold text-gray-600 text-xl">
          ADMIN DASHBOARD{" "}
        </div>

        <div
          className="flex gap-3 justify-center md:justify-start mb-2 font-bold bg-slate-200 outline outline-slate-400 rounded-md p-2 py-5 w-full"
        >
          <LiaChalkboardTeacherSolid className="text-2xl" />
          <span className="sm:hidden md:block">
            Hi, {`${user?.firstName} ${user?.lastName}`}{" "}
          </span>
        </div>
        {profileItems.map((tab, index) => (
          <NavLink
            to={tab.path}
            key={index}
            className={({ isActive }) =>
              `${
                isActive ? "bg-blue-300" : ""
              } flex gap-3 items-center justify-center md:justify-start hover:bg-gray-200  rounded-md p-2 py-5 w-full`
            }
            onClick={() => setIsSidebarOpen(false)} // Close sidebar when a menu item is clicked
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="sm:hidden md:block truncate">{tab.name}</span>
          </NavLink>
        ))}
        <AlertDialog>
          <AlertDialogTrigger
            className=" bg-red-500 mt-5  flex gap-3 items-center justify-center text-white
        md:justify-start hover:bg-red-300 rounded-md p-2 py-5 w-full"
          >
            <IoLogOutOutline className="text-2xl" />
            <span className="sm:hidden md:block">Logout</span>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Do you want to logout?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full px-10">
                No
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-blue-600 rounded-full px-10 hover:bg-blue-500"
                type="button"
                onClick={handleLogout}
              >
                Yes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex flex-grow sm:ml-[15%] md:ml-[20%] p-2 mt-20 sm:mt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
