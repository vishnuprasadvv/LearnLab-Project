import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAppSelector } from '@/app/hooks';

const GoogleLoginSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Redirect to the home page on success
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      {error ? <p>{error}</p> : <p>Loading...</p>}
    </div>
  );
};

export default GoogleLoginSuccess;
