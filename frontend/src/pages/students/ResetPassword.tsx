import { useAppDispatch } from '@/app/hooks';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { resetPasswordThunk, setError, startLoading } from '@/features/authSlice';
import { useFormik } from 'formik';
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { IoArrowBack } from 'react-icons/io5';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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
      newPassword: Yup.string()
        .min(5, 'Password must be atleast 5 characters')
        .required('Password is required'),
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
          console.log(response)
          toast.success('Reset password successful')
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

  return (
    <form onSubmit={formik.handleSubmit} className='md:w-1/3 lg:w-1/4  sm:w-1/2 items-center mx-auto  border rounded-md p-8 mt-10 '>
      <h1 className='text-2xl font-bold text-blue-600 text-center p-4 '>Reset Password</h1>
      <p className='text-center'>Please enter the 4-digit OTP sent to your email.</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }} className="pt-5 pb-10">
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            maxLength={1}
            ref={(el) => (inputRefs.current[index] = el)}
            style={{
              width: "50px",
              height: "50px",
              textAlign: "center",
              fontSize: "1.5rem",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        ))}


      </div>




      <div className='pb-3 pt-5 flex flex-col gap-2 text-start' >
        <label htmlFor='newPassword'>New Password:</label>
        <Input type="password" id='newPassword' name='newPassword' value={formik.values.newPassword} onChange={formik.handleChange} className='w-full '
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '5px',
            border: formik.touched.newPassword && formik.errors.newPassword ? '1px solid red' : '1px solid #ccc',
          }} />

        {formik.touched.newPassword && formik.errors.newPassword ? (
          <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.newPassword}</div>
        ) : null}
      </div>

      <div className='pb-3  flex flex-col gap-2 text-start' >
        <label htmlFor='confirmNewPassword'>Re-enter Password:</label>
        <Input type="password" id='confirmNewPassword' name='confirmNewPassword' value={formik.values.confirmNewPassword} onChange={formik.handleChange} className='w-full '
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '5px',
            border: formik.touched.confirmNewPassword && formik.errors.confirmNewPassword ? '1px solid red' : '1px solid #ccc',
          }} />

        {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword ? (
          <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.confirmNewPassword}</div>
        ) : null}
      </div>

      <div className='flex justify-center pt-5'>
        <Button className='bg-blue-600 rounded-full w-full hover:bg-blue-700' type='submit'  >Reset Password</Button>
      </div>
      <div className='flex justify-center pt-5'>
        <button onClick={handleBackToLoginButton} className='pl-2 text-gray-500 flex items-center'>
          <IoArrowBack className='size-6 self-center pr-2' />
          <span >Back to login</span>
        </button>
      </div>

    </form>
  )
}

export default ResetPassword