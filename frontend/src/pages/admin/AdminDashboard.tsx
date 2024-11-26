import React from 'react';
import Sidebar from '@/components/Admin/Sidebar';
import Dashboard from '@/components/Admin/Dashboard';

const AdminPage = () => {
  return (
    <div className='flex'>
      <Sidebar/>
      <Dashboard />
    </div>
  );
};

export default AdminPage;
