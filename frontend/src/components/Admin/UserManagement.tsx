import { useEffect, useState } from 'react';
import { getUsers, toggleUserStatus } from '@/api/adminApi';
import { MdEdit } from "react-icons/md";
import { LiaUserSlashSolid } from "react-icons/lia";
import { LiaUserSolid } from "react-icons/lia";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User } from '@/types/userTypes';
import { Input } from '../ui/input';


const UserManagement = () => {
  const [users, setUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()

  //search & pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response:any = await getUsers(searchQuery, currentPage, itemsPerPage);
      console.log(response)
      console.log(searchQuery, currentPage)
      setUsers(response.users)
      setTotalPages(Math.ceil(response.total / itemsPerPage))
      } catch (error:any) {
        toast.error(error?.response?.data?.message || 'Failed fetching users')
        console.error( error.message || 'something went wrong, fetching users data failed')
      }
      
    };
    fetchUsers();
  }, [searchQuery, currentPage]);


  const handleToggleUserStatus = async (userId: string , currentStatus: string) => {
    setIsLoading(true)
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const response = await toggleUserStatus(userId , newStatus)
      const updatedUser = response?.user;
      setUsers((prevUsers: Array<any>) => prevUsers.map((user : User) =>
        user._id === userId ? { ...user, status: updatedUser.status } : user
    ))
    } catch (error: any) {
      console.error('error block user', error)
      setError(error.message || 'Failed to block user')
      toast.error(error.message || 'Error blocking user')
    } finally {
      setIsLoading(false)
    }
  }
 
  //handle add user 
  const handleAddUser = () => {
    navigate('/admin/users/create')
  }

  const handleUserEditNavigate = (userId: string) => {
    navigate(`/admin/users/edit/${userId}`)
  }

  const handleSearch = (e:any) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1);
  }

  return (


    <div className='flex flex-col w-full p-1'>
      <h2 className='text-2xl font-bold text-dark-500 text-center '> All Users</h2>
      
      {/* Search bar */}
      <div className='flex'>
      <Input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={handleSearch}
        className="mb-4 p-2 border border-blue-100 rounded-full h-10 w-1/3 ml-2 shadow-md shadow-blue-100"
        />
        {/* <Button variant='outline' size='icon' onClick={handleSearch}><CiSearch /></Button> */}
        <Button className='bg-blue-600 rounded-full hover:bg-blue-700 ml-auto' onClick={handleAddUser}>Add User</Button>
        </div>
      
      
      <div className='overflow-auto'>
      <table className='text-sm text-left w-full rtl:text-right text-gray-500 dark:text-gray-400 overflow-x-scroll' >
        <thead className=' text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400' >
          <tr  className='bg-blue-200'>
            <th scope='col' className='lg:px-6 px-1 py-4 hidden lg:block'>ID</th>
            <th scope='col' className='lg:px-6 px-1 py-4'>Name</th>
            <th scope='col' className='lg:px-6 px-1 py-4'>Email</th>
            <th scope='col' className='lg:px-6 px-1 py-4'>Role</th>
            <th scope='col' className='lg:px-6 px-1 py-4 hidden lg:block'>Joined at</th>
            <th scope='col' className='lg:px-6 px-1 py-4'>Status</th>
            <th scope='col' className='lg:px-6 px-1 py-4'>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user._id} className='odd:bg-white  odd:dark:bg-gray-900 hover:bg-gray-100 even:bg-gray-50
            even:dark:bg-gray-800 border-b dark:border-gray-700'>
              <td className="lg:px-6 px-1 py-4  hidden lg:block">{user._id}</td>
              <td scope="row" className=" lg:px-6 px-1 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{`${user.firstName} ${user.lastName}`}</td>
              <td className="lg:px-6 px-1 py-4" >{user.email}</td>
              <td className="lg:px-6 px-1 py-4">{user.role}</td>
              <td className="px-1 py-4 hidden lg:block">{new Date(user.createdAt).toDateString()}</td>
              <td className="lg:px-6 px-1 py-4">{user.status}</td>
              <td className="lg:px-6 px-1 py-4">

                <div className='flex gap-2  '>

                  <AlertDialog>
                    <AlertDialogTrigger>
                        <div className='p-2 border rounded-md '>
                          {user.status&& user.status === 'active' ? 
                          <LiaUserSolid className='size-5'/> : 
                          <LiaUserSlashSolid className='size-5 text-red-500'/>}
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will {user.status === 'active' ? 'block' : 'unblock'} this user.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className='rounded-full'>Cancel</AlertDialogCancel>
                        <AlertDialogAction className='bg-blue-600 rounded-full' onClick={() => handleToggleUserStatus(user._id , user.status)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <button className='p-2 border rounded-md ' onClick={()=>handleUserEditNavigate(user._id)}>
                    <MdEdit className='size-5' />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 items-center">
  <Button variant='outline'
    className="px-4 py-2 mx-1 border rounded "
    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
    disabled={currentPage === 1}
  >
    Previous
  </Button>

  {/* Display previous page if not at the start */}
  {currentPage > 2 && (
    <Button variant='outline' size='icon'
      className="px-4 py-2 mx-1 border rounded"
      onClick={() => setCurrentPage(currentPage - 2)}
    >
      {currentPage - 2}
    </Button>
  )}

  {/* Display the page before current */}
  {currentPage > 1 && (
    <Button variant='outline' size='icon'
      className="px-4 py-2 mx-1 border rounded "
      onClick={() => setCurrentPage(currentPage - 1)}
    >
      {currentPage - 1}
    </Button>
  )}

  {/* Current page */}
  <Button variant='default' size='icon'
    className="px-4 py-2 mx-1 border rounded bg-blue-500 text-white"
  >
    {currentPage}
  </Button>

  {/* Display the page after current */}
  {currentPage < totalPages && (
    <Button variant='outline' size='icon'
      className="px-4 py-2 mx-1 border rounded "
      onClick={() => setCurrentPage(currentPage + 1)}
    >
      {currentPage + 1}
    </Button>
  )}

  {/* Display next page if not at the end */}
  {currentPage < totalPages - 1 && (
    <Button variant='outline' size='icon'
      className="px-4 py-2 mx-1 border rounded "
      onClick={() => setCurrentPage(currentPage + 2)}
    >
      {currentPage + 2}
    </Button>
  )}

  <Button variant='outline'
    className="px-4 py-2 mx-1 border rounded "
    onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
    disabled={currentPage === totalPages}
  >
    Next
  </Button>
</div>



      </div>
    </div>
  );
};

export default UserManagement;
