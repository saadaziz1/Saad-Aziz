import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { logout, isAuthenticated, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M49.7834 24.0839C49.3635 10.9327 38.7071 0.319787 25.5115 0C25.1716 0 24.8917 0.259827 24.8917 0.5996L24.8717 9.43371C24.8717 9.87342 24.5318 10.2132 24.092 10.2332C10.9364 10.6329 0.319893 21.3058 0 34.497C0 34.8368 0.259913 35.1166 0.5998 35.1166L9.41686 35.1366C9.85671 35.1366 10.1966 35.4763 10.2166 35.9161C10.6365 49.0673 21.3129 59.6802 34.4885 60C34.8284 60 35.1083 59.7402 35.1083 59.4004L35.1283 50.5663C35.1283 50.1266 35.4682 49.7868 35.908 49.7668C49.0636 49.3471 59.6801 38.6742 60 25.503C60 25.1632 59.7401 24.8834 59.4002 24.8834L50.5831 24.8634C50.1433 24.8634 49.8034 24.5236 49.7834 24.0839ZM34.2486 49.7069C26.7711 49.2672 20.7731 43.1912 20.4932 35.6762C20.4732 35.3564 20.2133 35.0966 19.8934 35.0966L11.0963 35.0766C10.6365 35.0766 10.2766 34.6969 10.2966 34.2372C10.7364 26.7622 16.8144 20.7662 24.3319 20.4863C24.6518 20.4664 24.9117 20.2065 24.9117 19.8867L24.9317 11.0726C24.9317 10.6129 25.3116 10.2532 25.7714 10.2732C33.2489 10.7129 39.2469 16.7888 39.5268 24.3038C39.5468 24.6236 39.8067 24.8834 40.1266 24.8834L48.9237 24.9034C49.3835 24.9034 49.7434 25.2831 49.7234 25.7428C49.2836 33.4177 42.9057 39.5137 35.1283 39.5137L35.1083 48.9074C35.0883 49.3671 34.7084 49.7268 34.2486 49.7069Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M24.6304 24.6827C24.6304 23.4734 25.927 22.7067 26.9866 23.2895L36.7729 28.672C37.8713 29.2761 37.8713 30.8543 36.7729 31.4584L26.9866 36.8408C25.9269 37.4236 24.6304 36.657 24.6304 35.4477V24.6827Z" fill="#E60000"/>
              </svg>
            </div>
            <span className="text-white text-xl font-bold">StreamVibe</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-primary transition-colors">Home</Link>
            <Link to="/movies-shows" className="text-white hover:text-primary transition-colors">Movies & Shows</Link>
            <Link to="/subscription" className="text-white hover:text-primary transition-colors">Support</Link>
            <Link to="/subscription" className="text-white hover:text-primary transition-colors">Subscriptions</Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="text-white hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Notification Icon */}
            <button className="text-white hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7h6m0 0V3m0 4l4 4H5l4-4z" />
              </svg>
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isSuperAdmin && (
                  <Link to="/superadmin" className="text-white hover:text-primary transition-colors">Dashboard</Link>
                )}
                {isAdmin && !isSuperAdmin && (
                  <Link to="/admin" className="text-white hover:text-primary transition-colors">Admin</Link>
                )}
                <Link to="/profile" className="text-white hover:text-primary transition-colors">Profile</Link>
                <button onClick={handleLogout} className="text-white hover:text-primary transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-white hover:text-primary transition-colors">Login</Link>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;