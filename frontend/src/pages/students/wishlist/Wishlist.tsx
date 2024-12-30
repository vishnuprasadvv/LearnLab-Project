import CourseWide from '@/components/common/Course/CourseWide'
import React from 'react'

const Wishlist:React.FC = () => {

    
  return (
    <div className='pt-2 flex items-center justify-center'>
        <div className='max-w-6xl w-full'>
            <h1 className='text-2xl font-bold text-center '>Wishlist</h1>
            <div className='p-2 w-full'>
                {[1,2,3,4].map((course) => (
                    <div className='flex justify-between'>
                        <CourseWide/>
                       
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Wishlist