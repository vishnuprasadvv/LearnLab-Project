import { NavLink, Outlet } from "react-router-dom";
import Logo from "../../../assets/LearnLab-Main-LOGO.svg";
import { Button } from "@/components/ui/button";
import { CiMenuBurger } from "react-icons/ci";
import { useEffect, useState } from "react";
import { CiMinimize1 } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LuHeart } from "react-icons/lu";
import { IoChatbubblesOutline } from "react-icons/io5";
import { getWishlistCourseIds } from "@/api/student";
import { setWishlistIds } from "@/features/wishlistSlice";
import { Badge } from "lucide-react";

const Navbar = () => {
  
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const wishlistCourseIds = useAppSelector((state) => state.wishlist.courseIds) || [];
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getWishlistCount = async() => {
      try {
        const response = await getWishlistCourseIds()
        const courseIds = response.data || []
        console.log('wishlistcount',response)
        console.log(courseIds)
        dispatch(setWishlistIds({courseIds: courseIds}))
      } catch (error) {
        console.error('getting wishlist course ids error', error)
      }
    }
    getWishlistCount()
  }, [dispatch])

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
      icon: <IoIosNotificationsOutline  className="hidden md:block" />,
    },
    {
      name: "Chat",
      path: "/chat",
      icon: <IoChatbubblesOutline  className="hidden md:block"/>,
    },
    {
      name: "Wishlist",
      path: "/wishlist",
      icon: (
        <div className="relative">
          <LuHeart className="hidden md:block"/>
          {wishlistCourseIds.length > 0 && (
            <div className="absolute -top-2 -right-2  bg-red-500 text-white text-xs rounded-full flex items-center justify-center min-w-4 px-auto h-4">
              {wishlistCourseIds.length}
            </div>
          )}
        </div>
    ),
    },
  ];

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
            md:pb-0 pb-5 absolute md:static bg-blue-50 md:z-auto z-[-1] left-0 
            w-full md:w-auto md:pl-0 pl-10 transistion-all duration-500 ease-in-out 
            ${open ? "top-[70px]" : "top-[-500px]"}`}
          >
            {Links.map((item) => (
              <li key={item.name} className=" md:mb-0 mb-5">
                <NavLink
                  to={item.path}
                  className={({isActive}) => `${isActive ? 'text-blue-500 border-b-2 border-blue-400 p-1' : 'text-gray-700'}  hover:text-blue-400 duration-300` }
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
                  className={({isActive}) => `${isActive ? 'text-blue-500 border-b-2 border-blue-400 p-1' : 'text-gray-700'} hover:text-blue-400 duration-500 text-xl hidden md:block`}
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                </NavLink>
                <NavLink
                  to={item.path}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-400 duration-500 md:hidden"
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                  {item.icon}
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
