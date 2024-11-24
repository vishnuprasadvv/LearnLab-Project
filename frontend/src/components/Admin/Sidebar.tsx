import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/authSlice';

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = async() => {
        try{
            const response = await dispatch(logout())
            console.log(response)
            navigate('/admin-login')
        }catch(error){
            console.log(error)
        }
    }
  return (
    <div style={{ width: '250px', padding: '20px' }} className='bg-blue-50 text-blue-500'>
      <h2 className='text-2xl font-bold'>Admin Panel</h2>
      <nav className='m-4'>
        <ul>
          <li className='p-5'><Link to="/admin/dashboard" >Dashboard</Link></li>
          <li className='p-5'><Link to="/admin/dashboard" >User Management</Link></li>
          <li className='p-5'><Button className='bg-red-600' onClick={handleLogout}>LOGOUT</Button></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
