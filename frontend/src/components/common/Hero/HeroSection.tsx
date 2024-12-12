import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import HomeHero from '../../../assets/HomeHero.svg'

const HeroSection = () => {
  return (
    <div className='flex place-content-center bg-gradient-to-r from-blue-400 to-indigo-600 dark:from-gray-800 dark:to-gray-900 py-16 px-4 text-center'>
        
        <div className='flex'>
      <div className='m-0 w-1/3 shrink-0 hidden lg:block duration-500 transition-all ease-out'>
        <img src={HomeHero} alt=""/>
      </div>
      <div className='max-w-3xl mx-auto '>
        <h1 className='text-white text-4xl font-bold mb-4'>Discover best classes for the best learning</h1>
        <p className='text-gray-200 dark:text-gray-400 mb-8'>Online learning and teaching marketplace with 5K+ courses & 10M students. Taught by experts to help you acquire new skills.</p>

        <form action="" className='flex items-center  dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6'>
          <Input type='text' className='focus-visible:ring-0 bg-white rounded-r-none rounded-l-full text-gray-900 dark:gray-800'/> 
          <Button className='bg-blue-600 dark:bg-blue-700 text-white px-6 py-4 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800'>Search</Button>
        </form>
        <Button className='bg-white dark:bg-800 text-blue-600 rounded-full hover:bg-gray-200'>Explore courses</Button>
      </div>
      </div>
      </div>
  )
}

export default HeroSection