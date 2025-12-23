import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';

interface UseProtectedRouteOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export const useProtectedRoute = ({
  requireAuth = false,
  requireAdmin = false,
  redirectTo = '/auth/login'
}: UseProtectedRouteOptions = {}) => {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only check once after initial mount
    if (hasChecked) return;

    const checkAuth = () => {
      setIsLoading(false);
      setHasChecked(true);
      
      // Check authentication requirement
      if (requireAuth && !isAuthenticated) {
        router.replace(redirectTo);
        return;
      }

      // Check admin role requirement
      if (requireAdmin && (!isAuthenticated || user?.role !== 'SUPER_ADMIN')) {
        router.replace(redirectTo);
        return;
      }
    };

    // Small delay to allow auth store to hydrate from localStorage
    const timer = setTimeout(checkAuth, 50);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, requireAuth, requireAdmin, redirectTo, router, hasChecked]);

  return {
    isAuthenticated,
    user,
    isAdmin: user?.role === 'SUPER_ADMIN',
    canAccess: !isLoading && (
      requireAdmin ? (isAuthenticated && user?.role === 'SUPER_ADMIN') : 
      requireAuth ? isAuthenticated : true
    ),
    isLoading
  };
};