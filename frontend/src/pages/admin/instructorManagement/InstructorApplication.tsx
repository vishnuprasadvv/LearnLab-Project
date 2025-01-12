import { Button } from '../../../components/ui/button'
import { useNavigate, useParams } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import { useEffect, useState } from 'react'
import { acceptInstructorApplicationAPI, getInstructorApplicationAPI, rejectInstructorApplicationAPI } from '@/api/adminApi'
import toast from 'react-hot-toast'
import { RegisterInstructorFormValues } from '@/types/instructor'
import { User } from '@/types/userTypes'

interface ApplicationRequestInterface extends RegisterInstructorFormValues{
  instructorId: User | undefined;
  createdAt: string;
  updatedAt : string;
  status: string
}
const InstructorApplication = () => {
  const navigate = useNavigate()
  const { id } = useParams<{id: string}>();
  const [application, setApplication] = useState<ApplicationRequestInterface | undefined>(undefined)

  if(!id){
    return (
      <>
      <h1>Id not found !</h1>
      </>
    )
  }

  useEffect(()=> {
    if(id){

      const getApplication = async() => {
        try {
          const response = await getInstructorApplicationAPI(id)
          setApplication(response?.application)
        } catch (error:any) {
          console.error(error)
          toast.error('Error getting data')
        }
      }
      
      getApplication();
    }else{
      navigate(-1)
      toast.error('Error getting information')
    }
  },[id])

  const handleAcceptRequest = async() => {
    try {
      const response = await acceptInstructorApplicationAPI(id);
      toast.success(response.message || response.data.message || 'Application request accepted')
      setApplication(response.application  )
      navigate(-1)
    } catch (error) {
      console.error(error)
    }
  }

  const handleRejectRequest = async() => {
    try {
      const response = await rejectInstructorApplicationAPI(id);
      toast.success(response.message || response.data.message || 'Application request accepted')
      setApplication(response.application  )
      navigate(-1)
    } catch (error) {
      console.error(error)
    }
  }
  return (

    <div className='sm:w-2/3 items-center mx-auto border rounded-md p-6 mt-10 bg-blue-50 bg-opacity-50'>
      <h1 className='text-2xl font-bold text-blue-600 text-center p-4 '>Application Request</h1>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col'>
          <span className='uppercase font-bold text-lg text-gray-700 '>{`${application?.instructorId?.firstName} ${application?.instructorId?.lastName}`}</span>
          <div className={`${application?.status==='pending' ? "bg-yellow-400" :(application?.status==='approved') ? "bg-green-400" : "bg-red-400"} w-fit  px-2 rounded-full`}>
      <span className=' text-white text-xs font-bold uppercase'>{application?.status}</span>
    </div>
        </div>
        <div className='flex gap-3 border border-blue-200 max-w-fit p-1 rounded-lg px-2 bg-blue-100'>
          <span className='font-semibold  text-gray-700'>
          Experience
          </span>
          <span>:</span>
          <span className='font-semibold text-gray-700'>{`${application?.experience} Year/s`}</span>  
        </div>
        <div className='flex gap-3'>
          <span className='font-semibold  text-gray-700'> Applied date</span>
          <span>:</span>
          <span>{application?.createdAt && new Date(application?.createdAt).toDateString()}</span>   
        </div>
        <div>
          <div className='font-semibold underline underline-offset-2 text-gray-700'>
          Qualifications
          </div>
          <div className='p-1 pl-6'>
            <ol>
              {application?.qualifications.map((value:string, index:number) => (
                <li key={index} className='p-0.5 list-disc'>
                  <span>{value}</span>
                </li>
              )
              )}
              
            </ol>
          </div>
        </div>
        <div>
          <div className='font-semibold underline underline-offset-2 text-gray-700'>
          Expertise
          </div>
          <div className='p-1 pl-6'>
            <ol>
              {application?.expertise.map((value:string, index:number) => (
                <li key={index} className='p-0.5 list-disc'>
                  <span>{value}</span>
                </li>
              )
              )}
              
            </ol>
          </div>
        </div>
        
        <div className='flex flex-col gap-1'>
          <span  className='font-semibold underline underline-offset-2 text-gray-700'>Comment</span>
          <p className='bg-blue-50 outline outline-blue-100 outline-2 rounded-lg p-2'>{application?.comment}</p>
        </div>
        <div className='flex flex-col gap-1'>
        <span  className='font-semibold underline underline-offset-2 text-gray-700'>Contact details</span>
          <div className='flex flex-col pb-0.5 pl-2'>
            <div className='flex  gap-2'>
            <span>Email</span>
            <span>:</span>
          <span className=' text-gray-700'>{application?.instructorId?.email}</span>  
            </div>
            <div className='flex  gap-2'>
            <span>Phone</span>
            <span>:</span>
          <span className=' text-gray-700'>{application?.instructorId?.phone}</span>  
            </div>
            </div> 
        </div>
      </div>
      {application?.status === 'pending' && 
      <div className='flex items-center text-center justify-center gap-2 pt-5 '>
      <Button className='border border-slate-200 bg-white text-blue-600 rounded-full  hover:bg-slate-100'
      onClick={handleRejectRequest} type="button"  >Reject</Button>
      <Button className='bg-blue-600 rounded-full  hover:bg-blue-700' type="button" onClick={handleAcceptRequest} >Accept</Button>
    </div>
    }
        
    <div className='flex justify-center pt-5'>
        <button onClick={() => navigate(-1)} type='button' className='pl-2 text-gray-500 flex items-center'>
          <IoArrowBack className='size-6 self-center pr-2' />
          <span >Go back</span>
        </button>
      </div>
    </div>
  )
}

export default InstructorApplication