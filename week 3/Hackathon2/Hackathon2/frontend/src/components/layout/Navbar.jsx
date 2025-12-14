import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { authService } from '@/services/authService';
import { Cart } from '@/components/Cart';

export const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    authService.removeToken();
    setIsUserDropdownOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand */}
          <div className="flex items-center">
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_166_115" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
                <rect width="48" height="48" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_166_115)">
                <path d="M22 42V26.05C19.8667 26.05 17.8167 25.6413 15.85 24.824C13.8833 24.008 12.15 22.85 10.65 21.35C9.15 19.85 8 18.1167 7.2 16.15C6.4 14.1833 6 12.1333 6 10V6H10C12.1 6 14.1333 6.408 16.1 7.224C18.0667 8.04133 19.8 9.2 21.3 10.7C22.3333 11.7333 23.192 12.8667 23.876 14.1C24.5587 15.3333 25.0833 16.65 25.45 18.05C25.6167 17.8167 25.8 17.592 26 17.376C26.2 17.1587 26.4167 16.9333 26.65 16.7C28.15 15.2 29.8833 14.0413 31.85 13.224C33.8167 12.408 35.8667 12 38 12H42V16C42 18.1333 41.592 20.1833 40.776 22.15C39.9587 24.1167 38.8 25.85 37.3 27.35C35.8 28.85 34.0747 30 32.124 30.8C30.1747 31.6 28.1333 32 26 32V42H22Z" fill="#1C1B1F"/>
              </g>
            </svg>
            <Link to="/dashboard" className="ml-2 text-lg font-bold text-gray-800">
              Brand Name
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              TEA COLLECTIONS
            </Link>
            <Link to="/accessories" className="text-gray-600 hover:text-gray-900 text-sm font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              ACCESSORIES
            </Link>
            <Link to="/blog" className="text-gray-600 hover:text-gray-900 text-sm font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              BLOG
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900 text-sm font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              CONTACT US
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6">
            {/* Search Icon */}
            <button className="hover:opacity-70">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_166_99" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_166_99)">
                  <path d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.371 4.888 14.113C3.62933 12.8543 3 11.3167 3 9.5C3 7.68333 3.62933 6.14567 4.888 4.887C6.146 3.629 7.68333 3 9.5 3C11.3167 3 12.8543 3.629 14.113 4.887C15.371 6.14567 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5627 11.8127 14 10.75 14 9.5C14 8.25 13.5627 7.18733 12.688 6.312C11.8127 5.43733 10.75 5 9.5 5C8.25 5 7.18733 5.43733 6.312 6.312C5.43733 7.18733 5 8.25 5 9.5C5 10.75 5.43733 11.8127 6.312 12.688C7.18733 13.5627 8.25 14 9.5 14Z" fill="#282828"/>
                </g>
              </svg>
            </button>
            
            {isAuthenticated ? (
              <>
                {/* User Icon with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="hover:opacity-70"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.146 12.1123 0.438 11.637C0.729334 11.1623 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64567 4.75 9.387C5.81667 9.129 6.9 9 8 9C9.1 9 10.1833 9.129 11.25 9.387C12.3167 9.64567 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2707 11.1623 15.562 11.637C15.854 12.1123 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9543 12.85 13.863 12.7C13.771 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5623 10.775 11.337C9.85833 11.1123 8.93333 11 8 11C7.06667 11 6.14167 11.1123 5.225 11.337C4.30833 11.5623 3.4 11.9 2.5 12.35C2.35 12.4333 2.22933 12.55 2.138 12.7C2.046 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.021 5.804 9.413 5.412C9.80433 5.02067 10 4.55 10 4C10 3.45 9.80433 2.97933 9.413 2.588C9.021 2.196 8.55 2 8 2C7.45 2 6.97933 2.196 6.588 2.588C6.196 2.97933 6 3.45 6 4C6 4.55 6.196 5.02067 6.588 5.412C6.97933 5.804 7.45 6 8 6Z" fill="black"/>
                    </svg>
                  </button>
                  
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                {/* Cart Icon */}
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="hover:opacity-70"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_166_105" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                      <rect width="24" height="24" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_166_105)">
                      <path d="M5 22C4.45 22 3.979 21.8043 3.587 21.413C3.19567 21.021 3 20.55 3 20V8C3 7.45 3.19567 6.97933 3.587 6.588C3.979 6.196 4.45 6 5 6H7C7 4.61667 7.48767 3.43733 8.463 2.462C9.43767 1.48733 10.6167 1 12 1C13.3833 1 14.5627 1.48733 15.538 2.462C16.5127 3.43733 17 4.61667 17 6H19C19.55 6 20.021 6.196 20.413 6.588C20.8043 6.97933 21 7.45 21 8V20C21 20.55 20.8043 21.021 20.413 21.413C20.021 21.8043 19.55 22 19 22H5ZM5 20H19V8H5V20ZM12 14C13.3833 14 14.5627 13.5123 15.538 12.537C16.5127 11.5623 17 10.3833 17 9H15C15 9.83333 14.7083 10.5417 14.125 11.125C13.5417 11.7083 12.8333 12 12 12C11.1667 12 10.4583 11.7083 9.875 11.125C9.29167 10.5417 9 9.83333 9 9H7C7 10.3833 7.48767 11.5623 8.463 12.537C9.43767 13.5123 10.6167 14 12 14ZM9 6H15C15 5.16667 14.7083 4.45833 14.125 3.875C13.5417 3.29167 12.8333 3 12 3C11.1667 3 10.4583 3.29167 9.875 3.875C9.29167 4.45833 9 5.16667 9 6Z" fill="#282828"/>
                    </g>
                  </svg>
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </nav>
  );
};