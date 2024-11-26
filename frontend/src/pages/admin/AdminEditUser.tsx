import EditUser from '@/components/Admin/EditUser'
import Sidebar from '@/components/Admin/Sidebar'

function AdminEditUser() {
  return (
    <div className='flex'>
        <Sidebar/>
        <EditUser/>
    </div>
  )
}

export default AdminEditUser