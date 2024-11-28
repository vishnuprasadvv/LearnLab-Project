import { Input } from '@/components/ui/input';
import { EyeClosed, EyeIcon } from 'lucide-react';
import React, { useState } from 'react'

interface PasswordFieldProps {
    label? : string;
    value : string;
    onchange: (value: string) => void;
    placeholder?: string;
    error?: string;
    touched? : boolean // only if you use formik 
    name: string;

}
const PasswordField: React.FC<PasswordFieldProps> = ({label, value, onchange, name, placeholder= 'Enter Password', error, touched}) => {

     //setup password visibility
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev)
  }
  return (
    <>
        {label && <label htmlFor={name}>{label}</label>}
    <div className='flex'>
    <Input type={isPasswordVisible ? "text" : "password"} id={name} name={name} placeholder={placeholder} 
    value={value} onChange={(e) => onchange(e.target.value)} />
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