import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { authSuccess, logoutSliceAction, validateUser } from "../features/authSlice"; 
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  requiredRole?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated ,user} = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

    console.log('role;' , user?.role)
  useEffect(() => {
    const checkAuth = async () => {
      try {
       const response = await dispatch(validateUser()).unwrap();
       const user = response.user
        console.log('protected route res',response)
        dispatch(authSuccess({user:{...user}}))
        setLoading(false);
      } catch (error) {
        console.log('protected route', error)
        toast.error('Unauthorized')
        dispatch(logoutSliceAction())
        setLoading(false); 
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />; 
  }

  if(requiredRole && user?.role !== requiredRole){
    return <Navigate to = '/unauthorized' />
  }

  return <Outlet/>
};

export default ProtectedRoute;
