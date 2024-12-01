import InstructorApplication from '@/components/Admin/instructorApplication'
import Sidebar from '@/components/Admin/Sidebar'

export const AdminInstructorApplication = () => {
  return (
    <div className='flex'>
        <Sidebar/>
        <InstructorApplication/>
    </div>
  )
}
