import { Input } from '@/components/ui/input';
import { EyeClosed, EyeIcon } from 'lucide-react';
import React, { useState } from 'react'

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement>{
    label? : string;
    value : string;
    onchange: (value: string) => void;
    placeholder?: string;
    error?: string;
    touched? : boolean // only if you use formik 
    name: string;
    className?:string;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void; 

}
const PasswordField: React.FC<PasswordFieldProps> = ({label, value, onchange, name,className,onBlur,  placeholder= 'Enter Password',}) => {

     //setup password visibility
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev)
  }
  return (
    <>
        {label && <label htmlFor={name}>{label}</label>}
    <div className='flex'>
    <Input type={isPasswordVisible ? "text" : "password"} id={name} name={name} className={className} placeholder={placeholder} 
    value={value} onChange={(e) => onchange(e.target.value)} onBlur={onBlur} />
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
  </>
  )
}

export default PasswordField