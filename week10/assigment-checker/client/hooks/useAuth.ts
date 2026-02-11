import { useMutation } from '@tanstack/react-query';
import { authService } from '../lib/services/authService';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const logoutStore = useAuthStore((state) => state.logout);

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            setAuth(data.user, data.access_token);
            if (data.user.role === 'teacher') {
                router.push('/teacher');
            } else if (data.user.role === 'moderator') {
                router.push('/moderator');
            } else {
                router.push('/student');
            }
        },
    });

    const signupMutation = useMutation({
        mutationFn: authService.signup,
        onSuccess: () => {
            router.push('/login');
        },
    });

    const logout = () => {
        logoutStore();
        router.push('/login');
    };

    return {
        login: loginMutation.mutate,
        isLoading: loginMutation.isPending,
        error: loginMutation.error,
        signup: signupMutation.mutate,
        isSigningUp: signupMutation.isPending,
        signupError: signupMutation.error,
        logout,
    };
};
