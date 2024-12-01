import { InstructorManagement } from '@/components/Admin/InstructorManagement'
import Sidebar from '@/components/Admin/Sidebar'

export const AdminInstructors = () => {
  return (
    <div className='flex'>
        <Sidebar/>
        <InstructorManagement/>
    </div>
  )
}
