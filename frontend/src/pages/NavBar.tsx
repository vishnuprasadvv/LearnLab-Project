import { Link, useNavigate } from "react-router-dom";
import Logo from '../assets/LearnLab-Main-LOGO.svg';
import { FaRegCircleUser } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout, logoutSliceAction } from "@/features/authSlice";
import { Button } from "@/components/ui/button";

function Navbar() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const {isAuthenticated, user} = useAppSelector((state) => state.auth)

    const handleLogout = ()=> {
        dispatch(logout());
        dispatch(logoutSliceAction())
        navigate(isAuthenticated ? '/home' : '/login')
    }

    return (
            <header className="p-3 max-h-15 w-100 items-center flex max-w-full-2xl border-b bg-blue-50">

                {isAuthenticated && user?.role === 'student' ? (
                    <Link to={'/home'} className=" inline-flex items-center justify-center ">
                    <div><img src={Logo} alt="Logo" className="h-auto w-32" /></div>

                </Link>
                ) : (
                    <Link to={'/'} className=" inline-flex items-center justify-center ">
                    <div><img src={Logo} alt="Logo" className="h-auto w-32" /></div>

                </Link>
                )}
                
                { !isAuthenticated ? (
                    <Link to={'/login'} className=" inline-flex ml-auto">
                    <div>
                        <FaRegCircleUser className="size-5"/>
                    </div>
                </Link>
                ) : (
                    <>
                    <Link className=" inline-flex ml-auto pr-5" to={'/profile/dashboard'}>{user?.firstName || 'profile'}</Link>
                    <Button  className="bg-red-500" onClick={handleLogout}>LOGOUT</Button>
                    </>
                )
            }
                
            </header>
    )
}

export default Navbar;