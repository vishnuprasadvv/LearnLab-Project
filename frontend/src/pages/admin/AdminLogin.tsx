import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { startLoading, setError, clearError } from '../../features/adminSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import 'react-google-signin-button/dist/button.css';
import { useFormik} from 'formik';
import * as Yup from 'yup';
import { EyeClosed, EyeIcon } from 'lucide-react';

import toast from 'react-hot-toast';
import { adminLoginSuccess } from '@/features/adminSlice';
import { adminLogin } from '@/api/adminApi';

const AdminLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated} = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(clearError())
    if(isAuthenticated){
      navigate('/admin/dashboard')
    }
    }
  , [])

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
        const result = await adminLogin(email, password )
        dispatch(
          adminLoginSuccess({
            user: result.user,
          })
        );
        navigate(result.user.role ==='admin'? '/admin/dashboard': '/unauthorized')
        toast.success('Login success')
      } catch (err:any) {
        dispatch(setError(err.response.data.message || 'Login failed.'));
        console.error('Login failed:', err);
        toast.error(err.response.data.message || 'Login failed')
      }
    }
    
  })

//setup password visibility
const [isPasswordVisible, setPasswordVisible] = useState(false);
const togglePasswordVisibility = () => {
  setPasswordVisible((prev) => !prev)
}  
  return (
    <form onSubmit={formik.handleSubmit} className='md:w-1/3 lg:w-1/4 sm:w-1/2 items-center mx-auto pt-10 border rounded-md p-6 mt-10'>
      <h1 className='text-2xl font-bold text-blue-600 text-center p-4 '>Admin Login</h1>
      <div className='pb-3 pt-5' >
        <Input type="email" id='email' name='email' placeholder='Email' value={formik.values.email} 
        onBlur={formik.handleBlur} onChange={formik.handleChange} className='w-full'
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

      <div className='flex'>
        <Input type={ isPasswordVisible ? "text" : "password"} id='password'name='password' placeholder='Password'
         value={formik.values.password} onBlur={formik.handleBlur} onChange={formik.handleChange}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '5px',
          border: formik.touched.password && formik.errors.password ? '1px solid red' : '1px solid #ccc',
        }} />
        <button type='button' onClick={togglePasswordVisibility}
          style={{
            position: 'relative',
            marginLeft: '-30px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
          }}>{isPasswordVisible ? <EyeIcon className='size-4 text-gray-400'/> : <EyeClosed className='size-4 text-gray-400'/>}
          </button>
          </div>

        {formik.touched.password && formik.errors.password ? (
            <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.password}</div>
          ) : null}
      </div>
      <div>
        <Link to={'/forgot-password?back=/admin-login'}>
          <span>forgot password?</span>
        </Link>
        
      </div>
      <div className='flex justify-center pt-5'>
        <Button className='bg-blue-600 rounded-full w-full hover:bg-blue-700' type="submit" disabled={isLoading}>Login</Button>
      </div>
    </form>
  );
};

export default AdminLogin;
