import React, { useEffect } from 'react';
import { googleLoginThunk } from '@/features/authSlice'; 
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

const GoogleLoginSuccess: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, error } = useAppSelector((state) => state.auth);

  

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home'); // Redirect to the home page on success
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      {error ? <p>{error}</p> : <p>Loading...</p>}
    </div>
  );
};

export default GoogleLoginSuccess;
