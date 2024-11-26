import { useAppDispatch, useAppSelector } from '@/app/hooks';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HomeHero from '../../assets/HomeHero.svg'
import bannertwo from '../../assets/whychooselearnlab.svg'
import featured from '../../assets/featured.svg'

function Home() {

  const navigate = useNavigate();
  const isAuthenticated  = useAppSelector((state) => state.auth.isAuthenticated)

  return (
    <div>
        <div className='flex w-full'>
          <div className='w-1/2'>

          <img src={HomeHero} alt="" />
          </div>
          <div className='align-center flex flex-col justify-center text-center w-1/2'>
          <div className='pb-10'>
            <p className='text-4xl font-bold text-blue-600'>Discover best classes for the best learning</p>
          </div>
          <div>
            <p className='text-blue-500'>Online learning and teaching marketplace with 5K+ courses & 10M students. Taught by experts to help you acquire new skills.</p>
          </div>
          </div>
        </div>
        <div>
          <img src={bannertwo} alt="" />
        </div>
        <div>
          <img src={featured} alt="" />
        </div>
    </div>
  )
}

export default Home