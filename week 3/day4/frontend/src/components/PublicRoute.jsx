import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function PublicRoute({ children }) {
  const { isAuthenticated, token } = useAuthStore();
 
  if (isAuthenticated && token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}