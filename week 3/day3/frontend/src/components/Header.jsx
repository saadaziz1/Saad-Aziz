import { Menu, X } from "lucide-react";
import { getToken, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useToggle } from "../hooks/useToggle";

export default function Header() {
  const [open, toggleOpen] = useToggle(false);
  const navigate = useNavigate();
  const token = getToken();
 

  return (
    <header className="w-full bg-[#1A1A40] shadow-md">
      <nav className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-xl font-bold text-white">MyLogo</h1>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 text-lg font-medium text-white">
         
         {!token && <li className="hover:text-purple-600 cursor-pointer" onClick={() => navigate('/')}>Login</li>}
         {token && <li className="hover:text-purple-600 cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</li>}
         {token && <button className="bg-red-600 p-3 rounded-lg w-fit text-white hover:bg-red-950" onClick={() => {logout(); navigate('/')}}>Logout</button>}
        </ul>

        {/* Mobile Hamburger Button */}
         <button
          className="md:hidden text-white"
          onClick={toggleOpen}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-[#1A1A40] shadow-md transition-all duration-300 overflow-hidden ${open ? "max-h-60" : "max-h-0"}`}
      >
        <ul className="flex flex-col py-3 px-4 gap-4 hover:text-purple-600 text-lg font-medium text-white">
         {!token && <li onClick={() => navigate('/')}>Login</li>}
         {token && <li onClick={() => navigate('/dashboard')}>Dashboard</li>}
         {token && <button className="bg-red-600 p-3 rounded-lg w-fit text-white" onClick={() => {logout(); navigate('/')}}>Logout</button>}
         
        </ul>
      </div>
    </header>
  );
}
