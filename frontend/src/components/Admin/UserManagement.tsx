import React, { useEffect, useState } from 'react';
import { deleteUser, getUsers } from '@/api/adminApi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setLoading } from '@/features/adminSlice';

type User = {
  _id: number;
  firstName: string;
  email: string;
  role: string;
};

const UserManagement = () => {
  const [users, setUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      console.log(users)
      setUsers(users);
    };
    fetchUsers();
  }, []);

 
    const handleDeleteUser = async(userId: string) => {
        setIsLoading(true)

        try {
            const response = await deleteUser(userId)
            console.log(response)
            setUsers((prevUsers :any) => prevUsers.filter((user:any) => user.id !== userId))
        } catch (error:any) {
            console.error('error deleting user', error)
            setError(error.message || 'Failed to delete user')
        }finally{
            setLoading(false)
        }
           
      }

  
  return (
    <div>
      <h2 className='text-2xl font-bold text-center pb-10'> User Management</h2>
      <table className='w-full items-center m-2'>
        <thead className=''>
          <tr>
            <th className=''>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user : any) => (
            <tr key={user._id}>
              <td className='p-3'>{user._id}</td>
              <td className='p-3'>{user.firstName}</td>
              <td className='p-3'>{user.email}</td>
              <td className='p-3'>{user.role}</td>
              <td >

                  <div className='flex '>
                  <button 
                  className=' bg-red-500 text-xs text-white p-3 m-2 h-5 w-12
        rounded-lg uppercase hover:opacity-95 disabled:opacity-80 flex items-center justify-center'
        onClick={() => handleDeleteUser(user._id)}
                   >Delete</button>
                  <button 
                  className=' bg-slate-700 text-xs text-white p-3 m-2 h-5 w-12
        rounded-lg uppercase hover:opacity-95 disabled:opacity-80 flex items-center justify-center' 
                  >Edit</button> 
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
