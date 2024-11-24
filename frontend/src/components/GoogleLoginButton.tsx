import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import {googleLoginAPI} from '../api/auth'
import axios from 'axios';


  const GoogleLoginButton = () => {
    const handleSuccess = async (response : any) => {
      try {
        const result = await axios.post('http://localhost:5000/api/auth/google-login', {
          token: response.credential,
        });
        console.log('Login Success:', result.data);
      } catch (error:any) {
        console.error('Login Failed:', error.response.data);
      }
    };

  return <GoogleLogin onSuccess={handleSuccess} onError={() => console.error('Login Failed')} />;
};

export default GoogleLoginButton;
