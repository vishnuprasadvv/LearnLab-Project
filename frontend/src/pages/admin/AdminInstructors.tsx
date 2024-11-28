import { InstructorManagement } from '@/components/Admin/InstructorManagement'
import Sidebar from '@/components/Admin/Sidebar'
import React from 'react'

export const AdminInstructors = () => {
  return (
    <div>
        <Sidebar/>
        <InstructorManagement/>
    </div>
  )
}
