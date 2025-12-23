import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8 mt-8">
            <div className="w-16 h-16 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M49.7834 24.0839C49.3635 10.9327 38.7071 0.319787 25.5115 0C25.1716 0 24.8917 0.259827 24.8917 0.5996L24.8717 9.43371C24.8717 9.87342 24.5318 10.2132 24.092 10.2332C10.9364 10.6329 0.319893 21.3058 0 34.497C0 34.8368 0.259913 35.1166 0.5998 35.1166L9.41686 35.1366C9.85671 35.1366 10.1966 35.4763 10.2166 35.9161C10.6365 49.0673 21.3129 59.6802 34.4885 60C34.8284 60 35.1083 59.7402 35.1083 59.4004L35.1283 50.5663C35.1283 50.1266 35.4682 49.7868 35.908 49.7668C49.0636 49.3471 59.6801 38.6742 60 25.503C60 25.1632 59.7401 24.8834 59.4002 24.8834L50.5831 24.8634C50.1433 24.8634 49.8034 24.5236 49.7834 24.0839ZM34.2486 49.7069C26.7711 49.2672 20.7731 43.1912 20.4932 35.6762C20.4732 35.3564 20.2133 35.0966 19.8934 35.0966L11.0963 35.0766C10.6365 35.0766 10.2766 34.6969 10.2966 34.2372C10.7364 26.7622 16.8144 20.7662 24.3319 20.4863C24.6518 20.4664 24.9117 20.2065 24.9117 19.8867L24.9317 11.0726C24.9317 10.6129 25.3116 10.2532 25.7714 10.2732C33.2489 10.7129 39.2469 16.7888 39.5268 24.3038C39.5468 24.6236 39.8067 24.8834 40.1266 24.8834L48.9237 24.9034C49.3835 24.9034 49.7434 25.2831 49.7234 25.7428C49.2836 33.4177 42.9057 39.5137 35.1283 39.5137L35.1083 48.9074C35.0883 49.3671 34.7084 49.7268 34.2486 49.7069Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M24.6304 24.6827C24.6304 23.4734 25.927 22.7067 26.9866 23.2895L36.7729 28.672C37.8713 29.2761 37.8713 30.8543 36.7729 31.4584L26.9866 36.8408C25.9269 37.4236 24.6304 36.657 24.6304 35.4477V24.6827Z" fill="#E60000"/>
              </svg>
            </div>
            <span className="text-white text-2xl font-bold">StreamVibe</span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
          <p className="text-gray-400">Join StreamVibe and start watching today</p>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-8 shadow-xl">
          {error && (
            <div className="bg-red-900/20 border border-red-900/30 text-red-400 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                placeholder="Create a password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-red-600 hover:text-red-500 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;