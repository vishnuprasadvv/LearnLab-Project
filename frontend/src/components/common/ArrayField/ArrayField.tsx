import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react'
import { IoCloseOutline } from "react-icons/io5";
import { IoAdd } from "react-icons/io5";

interface ArrayFiledInterface {
  values: string[];
  label: string;
  name: string;
  onChange: (newValue: string[]) => void
}

const ArrayField: React.FC<ArrayFiledInterface> = ({ name, label, values, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const handleAdd = () => {
    if (inputValue.trim() !== '') {
      onChange([...values, inputValue.trim()])
      setInputValue('')
    }
  }

  const handleRemove = (index: number) => {
    const updatedValues = values.filter((_, i) => i !== index);
    onChange(updatedValues)
  }
  return (
    <div>
      <label htmlFor={name} className='font-bold'>{label}</label>
      <div className='flex'>
        <Input type='text' value={inputValue} id={name} onChange={(e) => setInputValue(e.target.value)} placeholder={label} className='dark:bg-slate-800' />
        <Button size={'icon'} variant={'outline'} className='ml-1 dark:bg-slate-800'  type='button' onClick={handleAdd}><IoAdd/></Button>
      </div>
      <div className=' max-w-full overflow-y-auto mt-1' >
        <ul className='flex flex-wrap max-w-full overflow-x-auto'>
          {values.map((value, index) => (
            <li key={index}>
              <div className='bg-slate-100 dark:bg-blue-800 p-1 rounded-md m-1 flex gap-2 text-xs'>
                <span>{value}</span>
                <button type='button' onClick={() => handleRemove(index)}><IoCloseOutline /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ArrayField