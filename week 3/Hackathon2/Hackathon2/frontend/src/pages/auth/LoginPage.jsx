import { LoginForm } from '@/components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { authService } from '@/services/authService';

export const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLoginSuccess = (response) => {
    console.log('Login successful:', response);
    // Force a small delay to ensure token is set
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <LoginForm
        onSuccess={handleLoginSuccess}
        onSwitchToSignup={() => navigate('/signup')}
      />
    </div>
  );
};