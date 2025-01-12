import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { LiaUser, LiaUserEditSolid } from "react-icons/lia";
import { NavLink, Outlet } from "react-router-dom";
import { LiaBookReaderSolid } from "react-icons/lia";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { logout, logoutSliceAction } from "@/features/authSlice";
import { RxDashboard } from "react-icons/rx";
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

const ProfileSidebar = () => {
  const profileItems = [
    {
      path: "dashboard",
      name: "Dashboard",
      icon: <LiaUser />,
    },
    {
      path: "courses",
      name: "My courses",
      icon: <LiaBookReaderSolid />,
    },
    {
      path: "edit",
      name: "Edit profile",
      icon: <LiaUserEditSolid />,
    },
    {
      path: "change-password",
      name: "Change password",
      icon: <RiLockPasswordLine />,
    },
  ];

  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      const response = await dispatch(logout()).unwrap();
      dispatch(logoutSliceAction());
      toast.success(response.message || "Logout successful");
    } catch (err: any) {
      toast.error(err.message || "Logout failed");
    }
  };

  return (
    <div className="flex bg-slate min-h-screen">
      <div className="flex flex-col gap-2 border p-3 bg-gray-50 dark:bg-slate-700 bg-opacity-50 w-1/4 h-screen">
      {user?.role === 'instructor' && (<NavLink
          to={"/instructor/dashboard"}
          className="flex gap-3 items-center justify-center sm:justify-start mb-2 text-white font-bold  bg-blue-600 dark:bg-teal-500 dark:hover:bg-teal-400 hover:bg-blue-500 rounded-md p-2 py-5 w-full"
        >
          <RxDashboard className="text-2xl" />
          <span className="hidden sm:block">INSTRUCTOR PANEL</span>
        </NavLink>)}
        
        {profileItems.map((tab, index) => (
          <NavLink 
            to={tab.path}
            key={index}
            className={({ isActive }) =>
              `${
                isActive ? "bg-blue-300 dark:bg-blue-500" : " hover:bg-gray-200 dark:hover:bg-slate-800"
              } flex gap-3 items-center justify-center sm:justify-start  rounded-md p-2 py-5 w-full`
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
                className="bg-blue-600 rounded-full px-10"
                type="button"
                onClick={handleLogout}
              >
                Yes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileSidebar;
