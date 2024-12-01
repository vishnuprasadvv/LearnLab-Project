import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAppDispatch } from '@/app/hooks';
import { adminLogout } from '@/api/adminApi';
import { adminLogoutSliceAction } from '@/features/adminSlice';
import toast from 'react-hot-toast';

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = async() => {
        try{
            const response = await adminLogout()
            dispatch(adminLogoutSliceAction())
            console.log(response)
            toast.success(response?.data.message)
            navigate('/admin/login')
        }catch(error){
            console.log(error)
        }
    }

    const Menus = [
      {title : "Dashboard"},
      {title : "Dashboard"},
      {title : "Dashboard"},
      {title : "Dashboard"},
    ]
  return (
    <div className='bg-blue-50 text-blue-500 w-1/5 min-h-screen pt-5 text-center '>
      <h2 className='text-2xl font-bold'>Admin Panel</h2>
      <nav className='m-4'>
        <ul>
          <li className='p-5'><Link to="/admin/dashboard" >Dashboard</Link></li>
          <li className='p-5'><Link to="/admin/users" >User Management</Link></li>
          <li className='p-5'><Link to="/admin/instructors" >Instructor Management</Link></li>
          <li className='p-5'><Button className='bg-red-600' onClick={handleLogout}>LOGOUT</Button></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
