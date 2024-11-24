import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { startLoading, authSuccess, setError } from '../features/authSlice';
import { login } from '../features/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GoogleButton from 'react-google-signin-button';
import 'react-google-signin-button/dist/button.css';
import { useFormik} from 'formik';
import * as Yup from 'yup';

const AdminLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);


  const formik = useFormik({
    initialValues: {
      email : '',
      password: '',
    },
    validationSchema : Yup.object({
      email: Yup.string()
      .email('Invalid email adress')
      .required('Email is required'),
      password: Yup.string()
      .min(5, 'Password must be atleast 5 characters')
      .required('Password is required')
    }),
    onSubmit : async(values) => {
      dispatch(startLoading())
      try {
        const {email, password} = values
        const result = await dispatch(login({ email, password })).unwrap();
        //navigate(result.role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
        console.log(result)
        dispatch(
          authSuccess({
            user: result.user
          })
        );
        
        navigate(result.user.role ==='admin'? '/admin/dashboard': '/unauthorized')
      } catch (err:any) {
        dispatch(setError(err?.message || 'Login failed.'));
        console.error('Login failed:', err);
      }
    }
    
  })


  return (
    <form onSubmit={formik.handleSubmit} className='w-1/4 items-center mx-auto pt-10 border rounded-md p-6 mt-10'>
      <h1 className='text-2xl font-bold text-blue-600 text-center p-4 '>Admin Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className='pb-3 pt-5' >
        <label htmlFor='email'>Email:</label>
        <Input type="email" id='email' name='email' value={formik.values.email} onChange={formik.handleChange} className='w-full'
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '5px',
          border: formik.touched.email && formik.errors.email ? '1px solid red' : '1px solid #ccc',
        }}/>

        {formik.touched.email && formik.errors.email ? (
            <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.email}</div>
          ) : null}
      </div>
      <div className='pb-3'>
        <label htmlFor='password'>Password:</label>
        <Input type="password" id='password'name='password' value={formik.values.password} onChange={formik.handleChange}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '5px',
          border: formik.touched.password && formik.errors.password ? '1px solid red' : '1px solid #ccc',
        }} />

        {formik.touched.password && formik.errors.password ? (
            <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.password}</div>
          ) : null}
      </div>
      <div>
        <Link to={'/forgot-password'}>
          <span>forgot password?</span>
        </Link>
        
      </div>
      <div className='flex justify-center pt-5'>
        <Button className='bg-blue-600 rounded-full w-full hover:bg-blue-700' type="submit" disabled={loading}>Login</Button>
      </div>
      <div className='flex justify-center pt-5'>
        <span>Or you can </span>
      </div>
      <div className='flex justify-center pt-5'>
        <GoogleButton />
      </div>
      

    </form>
  );
};

export default AdminLogin;
