import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { ICourses } from "@/types/course"
import { getAllCoursesListApi } from "@/api/instructorApi"
import toast from "react-hot-toast"
import { Input } from "../ui/input"


const InstructorCourses = () => {

  const [courses, setCourses] = useState <ICourses[] | null> (null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCourses = async() => {
      try {
        setLoading(true)
        const response = await getAllCoursesListApi();
        setCourses(response.data)
        console.log(response.data)
      } catch (error:any) {
        toast.error(error.response.data || error.message || 'failed to fetch courses')
      }finally{
        setLoading(false)
      }
    } 
    fetchCourses()
  },[])

  return (
    <div className="container mx-auto px-4 py-8 w-full">
    <div className='flex flex-col w-full'>
    <h2 className='text-2xl font-bold text-dark-500 text-center '> Courses</h2>
      
      {/* Search bar */}
      <div className='flex flex-col sm:flex-row '>
      <Input
        type="text"
        placeholder="Search users..."
        className="mb-4 p-2 border w-full border-blue-100 rounded-full h-10 sm:w-1/3 ml-2 shadow-md shadow-blue-100"
        />
        {/* <Button variant='outline' size='icon' onClick={handleSearch}><CiSearch /></Button> */}
        <Link to={'/instructor/courses/create'}  className = ' ml-auto' >
        <Button className="bg-blue-600 rounded-full hover:bg-blue-700">Create course</Button>
        </Link>
        </div>

      <div className=' bg-blue-100 m-2 overflow-auto'>
        <table className='text-sm text-left w-full rtl:text-right text-gray-500 dark:text-gray-400 overflow-x-scroll'>
          <thead className=' text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr className='bg-blue-200'>
              <th scope='col' className='lg:px-6 px-1 py-4'>Title</th>
              <th scope='col' className='lg:px-6 px-1 py-4'>Instructor</th>
              <th scope='col' className='lg:px-6 px-1 py-4'>Created at</th>
              <th scope='col' className='lg:px-6 px-1 py-4'>Category</th>
              <th scope='col' className='lg:px-6 px-1 py-4'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses?.map((item) => (

              <tr key={item._id} className='odd:bg-white  odd:dark:bg-gray-900 hover:bg-gray-100 even:bg-gray-50
             even:dark:bg-gray-800 border-b dark:border-gray-700'
              >
                <td scope="row" className=" lg:px-6 px-1 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.title}</td>
                <td className="lg:px-6 px-1 py-4">{`${item.instructor?.firstName} ${item.instructor?.lastName}`}</td>
                <td className="lg:px-6 px-1 py-4">{new Date(item.createdAt).toDateString()}</td>
                <td className="lg:px-6 px-1 py-4">
                  <div >
                    {item.category?.name}
                  </div>
                </td>
                <td className="lg:px-6 px-1 py-4">
                  <button className=' text-white bg-blue-500 rounded-full px-2 py-1 uppercase font-semibold hover:bg-blue-600' >Edit</button>
                </td>
              </tr>
            )

            )}


          </tbody>
        </table>
      </div>

    </div>
  </div>
  )
}

export default InstructorCourses