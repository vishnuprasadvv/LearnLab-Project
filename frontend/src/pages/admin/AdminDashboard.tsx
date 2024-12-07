import { NavLink, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { LiaBookReaderSolid, LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { RxDashboard } from 'react-icons/rx';
import toast from 'react-hot-toast';
import { HiOutlineUsers } from "react-icons/hi2";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { IoLogOutOutline } from 'react-icons/io5';
import { MdOutlineCategory } from "react-icons/md";
import { adminLogout } from '@/api/adminApi';
import { adminLogoutSliceAction } from '@/features/adminSlice';

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
      path: "categories",
      name: "Category Management",
      icon: <MdOutlineCategory />,
    },
    {
      path: "notifications",
      name: "Notifications",
      icon: <IoMdNotificationsOutline />,
    },
  ];

  const { user } = useAppSelector((state) => state.admin);
  console.log(user);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      const response:any = await adminLogout();
      dispatch(adminLogoutSliceAction());
      toast.success(response.message || "Logout successful");
    } catch (err: any) {
      console.log(err);
      toast.error(err.message || "Logout failed");
    }
  };

  return (
    <div className="flex min-h-screen">
    <div className="flex flex-col gap-2 border p-3 bg-gray-50 bg-opacity-50 w-1/4">
    <div className="hidden sm:block uppercase font-bold text-gray-600 text-xl">ADMIN DASHBOARD</div>
    
    <div className="flex gap-3 justify-center sm:justify-start mb-2 font-bold 
     bg-slate-200 outline outline-slate-400 rounded-md p-2 py-5 w-full"
      >
        <LiaChalkboardTeacherSolid className="text-2xl" />
        <span className="hidden sm:block">Hi, {`${user?.firstName} ${user?.lastName}`} </span>
      </div>
      {profileItems.map((tab, index) => (
        <NavLink
          to={tab.path}
          key={index}
          className={({ isActive }) =>
            `${
              isActive ? "bg-blue-300" : ""
            } flex gap-3 items-center justify-center sm:justify-start hover:bg-gray-200  rounded-md p-2 py-5 w-full`
          }
        >
          <span className="text-2xl">{tab.icon}</span>
          <span className="hidden sm:block">{tab.name}</span>
        </NavLink>
      ))}
      <AlertDialog>
          <AlertDialogTrigger
            className=" bg-red-500 mt-5  flex gap-3 items-center justify-center text-white
        sm:justify-start hover:bg-red-300 rounded-md p-2 py-5 w-full"
          >
            <IoLogOutOutline className="text-2xl" />
            <span className="hidden sm:block">Logout</span>
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
    <div className="w-full pt-2">
      <Outlet />
    </div>
  </div>
  );
};

export default AdminPage;
