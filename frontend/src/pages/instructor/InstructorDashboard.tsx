import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout, logoutSliceAction } from "@/features/authSlice";
import toast from "react-hot-toast";
import { LiaBookReaderSolid } from "react-icons/lia";
import { RxDashboard } from "react-icons/rx";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { RiMessage2Line } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { RiArrowGoBackLine } from "react-icons/ri";

const InstructorDashboard = () => {
  const profileItems = [
    {
      path: "dashboard",
      name: "Dashboard",
      icon: <RxDashboard />,
    },
    {
      path: "courses",
      name: "My courses",
      icon: <LiaBookReaderSolid />,
    },
    {
      path: "messages",
      name: "Messages",
      icon: <RiMessage2Line />,
    },
    {
      path: "notifications",
      name: "Notifications",
      icon: <IoMdNotificationsOutline />,
    },
  ];

  const { user } = useAppSelector((state) => state.auth);
  console.log(user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await dispatch(logout()).unwrap();
      dispatch(logoutSliceAction());
      toast.success(response.message || "Logout successful");
    } catch (err: any) {
      console.log(err);
      toast.error(err.message || "Logout failed");
    }
  };

  return (
    <div className="flex bg-slate">
      <div className="flex flex-col gap-2 border p-3 bg-gray-50 bg-opacity-50 w-1/4 h-screen">
      <div className="hidden sm:block uppercase font-bold text-gray-600 text-xl">INSTRUCTOR DASHBOARD</div>
      
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
        <button className="flex gap-3 items-center justify-center sm:justify-start hover:bg-red-200  rounded-md p-2 py-5 w-full mt-auto"
        onClick={() => navigate('/profile/dashboard')}>
        <RiArrowGoBackLine className="text-2xl"/>
        <span className="hidden sm:block">Back to profile</span>
        </button>
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default InstructorDashboard