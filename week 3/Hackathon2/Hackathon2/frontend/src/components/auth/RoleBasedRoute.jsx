import { Navigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { jwtDecode } from 'jwt-decode';

export const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const token = authService.getToken();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;
    
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return children;
  } catch (error) {
    authService.removeToken();
    return <Navigate to="/login" replace />;
  }
};