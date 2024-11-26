import AddUser from '@/components/Admin/AddUser'
import Sidebar from '@/components/Admin/Sidebar'

function AdminAddUser() {
  return (
    <div className='flex'>
        <Sidebar/>
        <AddUser/>
    </div>
  )
}

export default AdminAddUser