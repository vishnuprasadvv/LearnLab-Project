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
        <div className="flex flex-col">
            <header className="px-4 lg:px-6 h-14 items-center flex border-b bg-blue-50">
                <Link to={'/home'} className="flex inline-flex items-center justify-center ">
                    <div><img src={Logo} alt="Logo" className="h-auto w-32" /></div>

                </Link>
                { !isAuthenticated ? (
                    <Link to={'/login'} className="flex inline-flex ml-auto">
                    <div>
                        <FaRegCircleUser className="size-5"/>
                    </div>
                </Link>
                ) : (
                    <>
                    <Link className="flex inline-flex ml-auto pr-5" to={'/profile'}>{user?.firstName || 'profile'}</Link>
                    <Button  className="bg-red-500" onClick={handleLogout}>LOGOUT</Button>
                    </>
                )
            }
                
            </header>
        </div>
    )
}

export default Navbar;