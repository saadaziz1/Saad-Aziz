import { SignupForm } from '@/components/auth/SignupForm';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { authService } from '@/services/authService';

export const SignupPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSignupSuccess = (response) => {
    console.log('Signup successful:', response);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <SignupForm
        onSuccess={handleSignupSuccess}
        onSwitchToLogin={() => navigate('/login')}
      />
    </div>
  );
};