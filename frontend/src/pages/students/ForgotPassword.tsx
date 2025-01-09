
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import {  useNavigate, useSearchParams } from 'react-router-dom';
import { useFormik} from 'formik';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import * as Yup from 'yup'
import { endLoading, forgotPasswordThunk, setError, startLoading } from '@/features/authSlice';
import { IoArrowBack } from "react-icons/io5";

function ForgotPassword() {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {loading} = useAppSelector((state) => state.auth)
  //back to login state 
  const  [searchParams] = useSearchParams();
  const backToLoginPath = searchParams.get('back') || '/login'

  const handleBackToLoginButton = () => {
    navigate(backToLoginPath)
  }

  const formik = useFormik({
    initialValues: {
      email : '',
      password: '',
    },
    validationSchema : Yup.object({
      email: Yup.string()
      .email('Invalid email adress')
      .required('Email is required')
    }),
    onSubmit : async(values) => {
      dispatch(startLoading())

      try {

      const {email} = values

      const response = dispatch(forgotPasswordThunk({email})).unwrap();
      await toast.promise(response, {
        loading:'Sending OTP... ',
        success: (data) => {
          return data.payload || 'OTP sent successfully'
        },
        error : (err) => {
          return err?.message || 'Failed to sent OTP. Try again!'
        }
        
      })

        dispatch(endLoading())
        //navigate to reset-password
        sessionStorage.setItem('forgot-password-email', email)
         navigate(`/reset-password?back=${backToLoginPath}`,{replace : true})
      } catch (err:any) {
        dispatch(setError(err?.message || 'OTP send failed.'));
        //toast.error(err.message || 'OTP send failed')
        console.error('Login failed:', err);
      }
    }
    
  })
  return (
    <div className=' min-h-[90vh]'>
    <form onSubmit={formik.handleSubmit} className='dark:bg-slate-800 md:w-1/3 lg:w-1/4  sm:w-1/2 items-center mx-auto pt-10 border rounded-md p-6 mt-10 '>
      <h1 className='text-2xl font-bold text-blue-600 text-center p-4 '>Forgot Password ?</h1>
      <h3 className='text-gray-500 text-sm text-center'>No worries, we'll send you reset instructions.</h3>
      <div className='pb-3 pt-10 flex flex-col gap-1' >
        <label htmlFor='email' >Email </label>
        <Input type="email" id='email' name='email' placeholder='Enter your email' value={formik.values.email} onChange={formik.handleChange}
        className={`w-full dark:bg-slate-800 p-2 mb-1 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-slate-500'}`}
        />

        {formik.touched.email && formik.errors.email ? (
            <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.email}</div>
          ) : null}
      </div>
      <div className='flex justify-center pt-5'>
        <Button className='bg-blue-600 dark:text-white dark:bg-blue-700 dark:hover:bg-blue-600 rounded-full w-full hover:bg-blue-700' type="submit" disabled={loading}>Continue</Button>
      </div>
      <div className='flex justify-center pt-5'>
        <button onClick={handleBackToLoginButton} className='pl-2 text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 hover:text-gray-600 flex items-center'> 
        <IoArrowBack className='size-6 self-center pr-2'/>
        <span>Back to login</span>
        </button>
      </div>

    </form>
    </div>
  );
  
}

export default ForgotPassword