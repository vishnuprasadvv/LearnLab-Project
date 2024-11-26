import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { sendOtp, verifyAccount } from "@/features/authSlice";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const OTPVerification = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')

  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [message, setMessage] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
 
  //set email 
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('userEmail')
    if(storedEmail){
      setEmail(storedEmail)
    }
  },[])

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

  // Combine OTP and send it for verification
  const handleVerify = async () => {
    setMessage('')
    const otpValue = otp.join("");
    if (otpValue.length === 4) {

      try {
        const response = await dispatch(verifyAccount({email : email ,otp:otpValue})).unwrap()
        console.log(response)
        toast.success('Account verification successfull')
        navigate('/login')
        
      } catch (error:any ) {
        const errorMessage = error?.message || 'An error occured during verification'
        setMessage( errorMessage);
        toast.error(error?.message || 'OTP verification failed')
        console.error('error',error)
      }

    } else {
      setMessage("Please enter a valid 4-digit OTP.");
      toast.error("Please enter a valid 4-digit OTP.");
    }
  };

  const handleResendOtp = async() => {
      try {
        const response = dispatch(sendOtp({email})).unwrap();
        await toast.promise(response, {
          loading: 'Sening OTP...',
          success:(data) => {
            return data.message || 'OTP sent successfully'},
            error: (err) => {
              return err?.message || 'Signup failed'
            }
          })
          console.log('resend otp front end',await response)
      } catch (error:any) {
        setMessage(error?.error || 'Error sending OTP')
        console.log(error)
      }
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}  className='sm:w-1/2 md:w-1/3 lg:w-1/4 items-center mx-auto pt-10 border rounded-md p-6 mt-10'>

      <h1 className='text-2xl font-bold text-blue-600 text-center p-4 '>Verify Your Account</h1>
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
     
      <div className='flex justify-center pt-5'>
        <Button className='bg-blue-600 rounded-full w-full hover:bg-blue-700' onClick={handleVerify} >Verify</Button>
      </div>
      <div className='flex justify-center pt-5'>
        <Button variant="link"  onClick={handleResendOtp} >Resend OTP</Button>
      </div>
    </div>
  );
};

export default OTPVerification;
