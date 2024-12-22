import { NavLink, Outlet } from "react-router-dom";
import Logo from "../../../assets/LearnLab-Main-LOGO.svg";
import { Button } from "@/components/ui/button";
import { CiMenuBurger } from "react-icons/ci";
import { useState } from "react";
import { CiMinimize1 } from "react-icons/ci";
import { useAppSelector } from "@/app/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LuShoppingCart, LuHeart } from "react-icons/lu";

const Navbar = () => {
  let Links = [
    {
      path: "/",
      name: "Home",
    },
    {
      path: "/courses",
      name: "Courses",
    },
    {
      path: "/about",
      name: "About",
    },
    {
      path: "/contact",
      name: "Contact us",
    },
  ];

  const IconsLinks = [
    {
      name: "Notifications",
      path: "/profile/notifications",
      icon: <IoIosNotificationsOutline />,
    },
    {
      name: "Wishlist",
      path: "/wishlist",
      icon: <LuHeart />,
    },
    {
      name: "Cart",
      path: "/cart",
      icon: <LuShoppingCart />,
    },
  ];

  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  return (
    <div className="">
      <div className="shadow-md w-full fixed top-0 left-0 z-20">
        <div className="md:flex items-center justify-between bg-blue-50 py-4 md:px-10 px-7 h-[70px] max-h-[70px]">
          <div className="flex items-center ">
            <img src={Logo} alt="Logo" className="h-auto w-32" />
          </div>
          <div
            onClick={() => setOpen(!open)}
            className="text-2xl absolute right-6 top-6 cursor-pointer md:hidden"
          >
            {open ? <CiMinimize1 /> : <CiMenuBurger />}
          </div>

          <ul
            className={`md:flex md:items-center uppercase gap-4
            md:pb-0 pb-12 absolute md:static bg-blue-50 md:z-auto z-[-1] left-0 
            w-full md:w-auto md:pl-0 pl-10 transistion-all duration-500 ease-in-out 
            ${open ? "top-[65px]" : "top-[-500px]"}`}
          >
            {Links.map((item) => (
              <li key={item.name} className=" md:mb-0 mb-5">
                <NavLink
                  to={item.path}
                  className="text-gray-700 hover:text-blue-400 duration-500 "
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}

            {IconsLinks.map((item) => (
              <li key={item.name} className="flex gap-3 md:mb-0 mb-5">
                <NavLink
                  to={item.path}
                  className="text-gray-700 hover:text-blue-400 duration-500 text-xl hidden md:block"
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                </NavLink>
                <NavLink
                  to={item.path}
                  className="text-gray-700 hover:text-blue-400 duration-500 md:hidden"
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}

            {isAuthenticated ? (
              <NavLink to={"/profile/dashboard"} onClick={() => setOpen(false)}>
                <Avatar className="hover:border-2 border-blue-400 border-spacing-3">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    <img
                      src={
                        user?.profileImageUrl ||
                        "https://avatar.iran.liara.run/public/36"
                      }
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </AvatarFallback>
                </Avatar>
                <span className=" md:hidden">Profile</span>
              </NavLink>
            ) : (
              <NavLink to={"/login"} onClick={() => setOpen(false)}>
                <Button className="rounded-full text-xs bg-blue-600 hover:bg-blue-400 duration-500">
                  Login
                </Button>
              </NavLink>
            )}
          </ul>
        </div>
      </div>
      <div className="pt-[70px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Navbar;
