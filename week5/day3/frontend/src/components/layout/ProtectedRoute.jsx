import { Navigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, hasRole, user } = useAuthStore();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    // Allow superadmin to access admin routes
    if (requiredRole === 'admin' && (hasRole('admin') || hasRole('superadmin'))) {
      return children;
    }
    // For superadmin-only routes
    if (requiredRole === 'superadmin' && hasRole('superadmin')) {
      return children;
    }
    // If role doesn't match
    if (!hasRole(requiredRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;