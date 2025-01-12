import { useAppDispatch } from '@/app/hooks';
import PasswordFieldTwo from '@/components/common/PasswordField/PasswordFieldtwo';
import { Button } from '@/components/ui/button'
import { resetPasswordThunk, sendOtp, setError, startLoading } from '@/features/authSlice';
import { formikPasswordValidation } from '@/utils/formikPasswordValidator';
import { useFormik } from 'formik';
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup'

function ResetPassword() {

  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [searchParams] = useSearchParams();
  const backToLoginPath = searchParams.get('back') || '/login'
  const handleBackToLoginButton = () => {
    navigate(backToLoginPath)
  }

  const email = sessionStorage.getItem('forgot-password-email') || ''

  // Handle input change for each OTP field
  const handleInputChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Automatically move to the next field if value is entered
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace to move to the previous input
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmNewPassword: '',

    },
    validationSchema: Yup.object({
      newPassword: formikPasswordValidation(),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Password miss match')
        .required('Confirm password is required'),

    }),
    onSubmit: async (values) => {
      dispatch(startLoading())
      const otpInput = otp.join("");

      if (otpInput.length === 4) {
        try {
          const response = await dispatch(resetPasswordThunk({ email, otp: otpInput, password: values.newPassword })).unwrap();
          toast.success(response.message || 'Reset password successful')
          navigate(backToLoginPath, { replace: true })

        } catch (err: any) {
          dispatch(setError(err?.message || 'Login failed.'));
          toast.error(err.message || 'Login failed')
          console.error('Login failed:', err);
        }
      } else {
        toast.error('Please enter 4 digit valid OTP')
      }
    }

  })

  const handleResendOtp = async() => {
    try {
      const response = dispatch(sendOtp({email})).unwrap();
      await toast.promise(response, {
        loading: 'Sening OTP...',
        success:(data) => {
          return data.message || 'OTP sent successfully'},
          error: (err) => {
            return err?.message || 'Email verification failed'
          }
        })
    } catch (error:any) {
      toast.error(error?.error || 'Error sending OTP')
    }
}

  return (
    <div className=' min-h-[90vh]'>
    <form onSubmit={formik.handleSubmit} className='md:w-1/3 lg:w-1/4  sm:w-1/2 items-center mx-auto  border rounded-md p-8 mt-10 dark:bg-slate-800'>
      <h1 className='text-2xl font-bold text-blue-600 text-center p-4 '>Reset Password</h1>
      <p className='text-center'>Please enter the 4-digit OTP sent to your email.</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }} className="pt-5">
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            maxLength={1}
            ref={(el) => (inputRefs.current[index] = el)}
            className="dark:bg-slate-700 w-[50px] h-[50px] text-2xl text-center border rounded-md border-gray-300 dark:border-slate-600"
          />
        ))}
      </div>

       <div className='flex justify-center pt-5'>
              <Button variant="link" className='hover:text-blue-600'  onClick={handleResendOtp} >Resend OTP</Button>
            </div>

      <div className='pb-3 pt-5 flex flex-col gap-2 text-start' >
          <PasswordFieldTwo label='New Password' onBlur={formik.handleBlur} name='newPassword' id='newPassword' value={formik.values.newPassword} onChange={formik.handleChange} error={formik.errors.newPassword} touched={formik.touched.newPassword}/>
      </div>

      <div className='pb-3  flex flex-col gap-2 text-start' >
          <PasswordFieldTwo onBlur={formik.handleBlur} label='Re-enter Password' name='confirmNewPassword' id='confirmNewPassword' value={formik.values.confirmNewPassword} onChange={formik.handleChange} error={formik.errors.confirmNewPassword} touched={formik.touched.confirmNewPassword}/>
      </div>

      <div className='flex justify-center pt-5'>
        <Button className='bg-blue-600 rounded-full w-full hover:bg-blue-700 dark:text-white dark:bg-blue-700 dark:hover:bg-blue-600' type='submit'  >Reset Password</Button>
      </div>
      <div className='flex justify-center pt-5'>
        <button onClick={handleBackToLoginButton} className='pl-2 dark:text-gray-400 dark:hover:text-gray-300 text-gray-500 flex items-center'>
          <IoArrowBack className='size-6 self-center pr-2' />
          <span >Back to login</span>
        </button>
      </div>

    </form>
    </div>
  )
}

export default ResetPassword