import { useState } from 'react';
import AdminNav from '../admin/AdminNav';
import { MenuIcon, X } from 'lucide-react';

const AdminLayout = ({ children, pageTitle }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen min-w-screen">
      <AdminNav isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
      <main className="flex-1 w-full lg:w-[840px] xl:w-[1090px] ">
        <div className="lg:hidden flex justify-between items-center p-4 border-b">
          <span></span>
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="p-2 border border-gray-300 rounded shadow-sm"
          >
            {isNavOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;