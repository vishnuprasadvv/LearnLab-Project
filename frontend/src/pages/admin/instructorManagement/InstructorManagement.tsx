import { useAppDispatch } from '@/app/hooks'
import ResultsNotFound from '@/components/common/NoResults/ResultsNotFound'
import { getInstructorsThunk } from '@/features/adminSlice'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function InstructorManagement() {

  const [instructors, setInstructors] = useState([])
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await dispatch(getInstructorsThunk()).unwrap();
        setInstructors(response?.instructors)
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed fetching instructors applications list')
        console.error(error.message || 'something went wrong, fetching instructors data failed')
      }

    };
    fetchInstructors();


  }, [])

  
  const handleViewApplication = (id: string) => {
    navigate(`/admin/instructors/application/${id}`)
  }

  return (
    <div className='flex flex-col w-full'>
      <h1 className='text-2xl font-bold text-dark-500 text-center'>Instructor requests </h1>

        {instructors.length > 0 ? (
      <div className=' bg-blue-100 m-2 overflow-auto'>
 <table className='text-sm text-left w-full rtl:text-right text-gray-500 dark:text-gray-400 overflow-x-scroll'>
 <thead className=' text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
   <tr className='bg-blue-200'>
     <th scope='col' className='lg:px-6 px-1 py-4'>Name</th>
     <th scope='col' className='lg:px-6 px-1 py-4'>Email</th>
     <th scope='col' className='lg:px-6 px-1 py-4'>Applied Date</th>
     <th scope='col' className='lg:px-6 px-1 py-4 text-center'>Status</th>
     <th scope='col' className='lg:px-6 px-1 py-4'>Actions</th>
   </tr>
 </thead>
 <tbody>
   {instructors.map((instructor: any, index: number) => (

     <tr key={index} className='odd:bg-white  odd:dark:bg-gray-900 hover:bg-gray-100 even:bg-gray-50
    even:dark:bg-gray-800 border-b dark:border-gray-700'
     >
       <td scope="row" className=" lg:px-6 px-1 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{`${instructor?.instructorId.firstName} ${instructor?.instructorId.lastName}`}</td>
       <td className="lg:px-6 px-1 py-4">{instructor?.instructorId.email}</td>
       <td className="lg:px-6 px-1 py-4">{new Date(instructor?.instructorId.createdAt).toDateString()}</td>
       <td className="lg:px-6 px-1 py-4">
         <div className={`${instructor?.status === 'pending' ? "bg-yellow-400" : (instructor?.status === 'approved') ?
           "bg-green-400" : "bg-red-400"} py-1 px-2 text-white text-xs font-semibold text-center rounded-full uppercase`}>
           {instructor.status}
         </div>
       </td>
       <td className="lg:px-6 px-1 py-4">
         <button className=' text-white bg-blue-500 rounded-full px-2 py-1 uppercase font-semibold hover:bg-blue-600' onClick={() => handleViewApplication(instructor._id)}>Open</button>
       </td>
     </tr>
   )

   )}


 </tbody>
</table>
      </div>
        ) : (
          <ResultsNotFound />
        )}
       

    </div>
  )
}
