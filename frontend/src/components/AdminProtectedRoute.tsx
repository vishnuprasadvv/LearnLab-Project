import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { validateUser } from "../features/authSlice"; 

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string
}

const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated ,user} = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

    console.log('role;' , user)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(validateUser());
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
    return <Navigate to="/admin-login" />; 
  }

  if(requiredRole && user?.role !== requiredRole){
    return <Navigate to = '/unauthorized' />
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
