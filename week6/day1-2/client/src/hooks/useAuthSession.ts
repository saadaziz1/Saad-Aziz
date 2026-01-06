import { useAuthStore } from '@/store/useAuthStore';
import { useLoginMutation, useRegisterMutation } from '@/api/authApi';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks/redux';
import { baseApi } from '@/api/baseApi';

export const useAuthSession = () => {
    const { user, token, setAuth, logout, isAuthenticated } = useAuthStore();
    const [loginApi, { isLoading: isLoginLoading }] = useLoginMutation();
    const [registerApi, { isLoading: isRegisterLoading }] = useRegisterMutation();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleLogin = async (credentials: any) => {
        try {
            const response = await loginApi(credentials).unwrap();
            // On backend, login returns { accessToken }
            // We might need to fetch the user profile separately if it's not in the response
            // Let's assume the response has some basic user info or we use getMe later
            setAuth(response.user || { email: credentials.email }, response.accessToken);
            router.push('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const handleRegister = async (userData: any) => {
        try {
            await registerApi(userData).unwrap();
            router.push('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const handleLogout = () => {
        logout();
        // Reset RTK Query cache on logout
        dispatch(baseApi.util.resetApiState());
        router.push('/login');
    };

    return {
        user,
        token,
        isAuthenticated,
        handleLogin,
        handleRegister,
        handleLogout,
        isLoginLoading,
        isRegisterLoading,
    };
};
