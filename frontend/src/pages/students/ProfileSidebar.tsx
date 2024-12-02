import { useAppSelector } from "@/app/hooks";
import { LiaUser, LiaUserEditSolid } from "react-icons/lia";
import { NavLink, Outlet } from "react-router-dom";
import { LiaBookReaderSolid } from "react-icons/lia";
import { TbPasswordFingerprint } from "react-icons/tb";
import { RiLockPasswordLine } from "react-icons/ri";

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
  console.log(user);

  return (
    <div className="flex">
      <div className="flex flex-col gap-2 border p-3 bg-gray-50 bg-opacity-50 h-screen w-1/4">
        {profileItems.map((tab, index) => (
          <NavLink to={tab.path} key={index} className={({isActive}) => `${isActive ? 'bg-blue-300' : ''} flex gap-3 items-center hover:bg-gray-200  rounded-md p-2 py-5 w-full`}>
        
              <span className="text-2xl">{tab.icon}</span>
              <span>{tab.name}</span>
          </NavLink>
        ))}
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileSidebar;
