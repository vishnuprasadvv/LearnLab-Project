import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { startLoading, authSuccess, setError, clearError, sendOtp } from '../../features/authSlice';
import { login } from '../../features/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import 'react-google-signin-button/dist/button.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import { EyeClosed, EyeIcon } from 'lucide-react';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);
  useEffect(() => {
    dispatch(clearError())
    if (isAuthenticated) {
      navigate('/')
    }
  }
    , [])

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email adress')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be atleast 6 characters')
        .required('Password is required')
    }),
    onSubmit: async (values) => {
      dispatch(startLoading())
      const { email, password } = values
      try {
        const result = await dispatch(login({ email, password, role: 'student' })).unwrap();
        dispatch(
          authSuccess({
            user: result.user
          })
        );
        toast.success(result.message || 'Login success')
        navigate('/', { replace: true })
      } catch (err: any) {


        if (err.message === 'User not verified') {
          toast.error('Please verify your account')
          try {
            const verifyAccountResponse = await dispatch(sendOtp({ email })).unwrap()
            sessionStorage.setItem("userEmail", email);
            toast.success(verifyAccountResponse.message || 'OTP sent successfully, Check your email')
            navigate('/verify-account')
          } catch (error) {
            toast.error('Error sending OTP')
          }
          //navigate('/verify-account')
        } else {
          dispatch(setError(err?.message || 'Login failed.'));
          toast.error(err.message || 'Login failed')
          console.error('Login failed:', err);
        }
      }
    }

  })

  //setup password visibility
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev)
  }


  return (
    <div className=' min-h-[90vh]'>
    <div className='md:w-1/3 lg:w-1/4 sm:w-1/2 items-center mx-auto pt-10 border rounded-md p-6 mt-10 dark:bg-slate-800'>
      <h1 className='text-2xl font-bold text-blue-600 text-center p-4 '>Login</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className='pb-3 pt-5' >
          <Input type="email" id='email' name='email' placeholder='Email' value={formik.values.email} 
          onBlur={formik.handleBlur} onChange={formik.handleChange} 
          className={`w-full dark:bg-slate-700 p-2 mb-1 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
            />

          {formik.touched.email && formik.errors.email ? (
            <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.email}</div>
          ) : null}
        </div>
        <div className='pb-3'>

          <div className='flex'>
            <Input type={isPasswordVisible ? "text" : "password"} id='password' name='password' placeholder='Password'
             value={formik.values.password} onBlur={formik.handleBlur} onChange={formik.handleChange}
             className={`w-full dark:bg-slate-700 p-2 mb-1 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
               />
            <button type='button' onClick={togglePasswordVisibility}
              style={{
                position: 'relative',
                marginLeft: '-30px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
              }}>{isPasswordVisible ? <EyeIcon className='size-4 text-gray-400' /> : <EyeClosed className='size-4 text-gray-400' />}
            </button>
          </div>

          {formik.touched.password && formik.errors.password ? (
            <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.password}</div>
          ) : null}
        </div>
        <div>
          <Link to={'/forgot-password?back=/login'}>
            <span>forgot password?</span>
          </Link>
        </div>
        <div className='flex justify-center pt-5'>
          <Button className='bg-blue-600 rounded-full w-full hover:bg-blue-700 dark:text-white dark:bg-blue-700 dark:hover:bg-blue-600' type="submit" disabled={loading}>Login</Button>
        </div>
      </form>

      <div className='flex justify-center pt-5'>
        <span>Or you can </span>
      </div>
      <div className='flex justify-center pt-5'>
        <GoogleLoginButton />
      </div>
      <div className='flex justify-center pt-5'>
        <span>Don't have an account?  </span>
        <Link to={'/signup'} className='pl-2 font-bold text-blue-600'><span >Sign Up</span></Link>
      </div>

    </div>

    </div>
  );
};

export default Login;
