
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';

const AdminPanel = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        
        <UserManagement /> {/* Include user management */}
        {/* You can include other components like Dashboard */}
      </div>
    </div>
  );
};

export default AdminPanel;
