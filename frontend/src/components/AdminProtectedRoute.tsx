import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { validateUser } from "../features/authSlice"; 

interface ProtectedRouteProps {
  requiredRole?: string
}

const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated ,user} = useAppSelector((state) => state.admin);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

    console.log('role;' , user)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        //const res = await dispatch(validateUser());
        //console.log(res)
        
        setLoading(false);
      } catch (error) {
        setLoading(false); 
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />; 
  }

  if(requiredRole && user?.role !== requiredRole){
    return <Navigate to = '/unauthorized' />
  }

  return <Outlet/>
};

export default AdminProtectedRoute;
