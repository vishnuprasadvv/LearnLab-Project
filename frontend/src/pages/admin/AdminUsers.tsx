import Sidebar from '@/components/Admin/Sidebar'
import UserManagement from '@/components/Admin/UserManagement'
import React from 'react'

function AdminUsers() {
  return (
    <div className='flex'>
        <Sidebar/>
        <UserManagement/>
    </div>
  )
}

export default AdminUsers