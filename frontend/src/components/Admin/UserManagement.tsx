import React, { useEffect, useState } from 'react';
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


const UserManagement = () => {
  const [users, setUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
      console.log(users)
      setUsers(users)
      } catch (error:any) {
        toast.error(error?.response?.data?.message || 'Failed fetching users')
        console.error( error.message || 'something went wrong, fetching users data failed')
      }
      
    };
    fetchUsers();
  }, []);


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

  return (
    <div className='flex flex-col min-w-full p-5'>
      <div className='self-end mr-3'>
         <Button className='bg-blue-600 rounded-full hover:bg-blue-700' onClick={handleAddUser}>Add User</Button>
      </div>
      <h2 className='text-2xl font-bold text-center pb-5'> All Users</h2>
      
      <table className='items-center m-2 table-fixed border-collapse border border-slate-200 rounded-xl bg-slate-50' >
        <thead className='bg-blue-50' >
          <tr >
            <th className='border border-blue-400 p-3 text-start max-w-4'>ID</th>
            <th className='border border-blue-400 p-3 text-start'>Name</th>
            <th className='border border-blue-400 p-3 text-start max-w-5'>Email</th>
            <th className='border border-blue-400 p-3 text-start'>Role</th>
            <th className='border border-blue-400 p-3 text-start max-w-3'>Joined at</th>
            <th className='border border-blue-400 p-3 text-start'>Status</th>
            <th className='border border-blue-400 p-3 text-start'>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user._id}>
              <td className=' p-3 text-start border border-gray-200'>{user._id}</td>
              <td className= 'p-3 text-start border border-gray-200'>{user.firstName}</td>
              <td className= 'p-3 text-start border border-gray-200' >{user.email}</td>
              <td className= 'p-3 text-start border border-gray-200'>{user.role}</td>
              <td className= 'p-3 text-start border border-gray-200'>{new Date(user.createdAt).toDateString()}</td>
              <td className= 'p-3 text-start border border-gray-200'>{user.status}</td>
              <td className= 'p-3 text-start border border-gray-200 place-items-center'>

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
    </div>
  );
};

export default UserManagement;
