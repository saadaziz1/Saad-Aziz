import { useState } from 'react';
import AdminNav from '../admin/AdminNav';
import { MenuIcon, X } from 'lucide-react';

const AdminLayout = ({ children, pageTitle }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen border-r">
      <AdminNav isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
      <div className="flex-1 lg:ml-0">
        <div className="lg:hidden flex justify-between items-center p-4 ">
          <span></span>
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="p-2 border border-gray-300 rounded shadow-sm"
          >
            {isNavOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;