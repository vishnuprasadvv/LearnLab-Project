import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { validateAdminAuth } from "@/api/adminApi";
import toast from "react-hot-toast";
import { adminLogoutSliceAction } from "@/features/adminSlice";

interface ProtectedRouteProps {
  requiredRole?: string
}

const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated ,user} = useAppSelector((state) => state.admin);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await validateAdminAuth();
        setLoading(false);
      } catch (error) {
        setLoading(false); 
        toast.error('Please login')
        dispatch(adminLogoutSliceAction())
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
