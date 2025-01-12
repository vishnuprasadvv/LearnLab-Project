import React from 'react'
interface CustomToggleButtonProps {
    isChecked: boolean;
    onToggle: (value : boolean) => void
}
const CustomToggleButton:React.FC<CustomToggleButtonProps> = ({isChecked, onToggle}) => {
  const handleToggle= () => {
    onToggle(!isChecked)
}

  return (
    <>
      <label className='flex cursor-pointer select-none items-center'>
        <div className='relative'>
          <input
            type='checkbox'
            checked={isChecked}
            onChange={handleToggle}
            className='sr-only'
            aria-checked={isChecked}
          />
          <div
          className={`block h-6 w-11 rounded-full transition ${
            isChecked ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        ></div>
        <div
          className={`dot absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition transform ${
            isChecked ? 'translate-x-6' : 'translate-x-1'
          }`}
        ></div>
        </div>
      </label>
    </>
  )
}

export default CustomToggleButton
