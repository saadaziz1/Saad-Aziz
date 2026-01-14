import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    provider?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            setAuth: (user, token) => {
                localStorage.setItem('auth-token', token);
                Cookies.set('auth-token', token, { expires: 7, path: '/' });
                Cookies.set('user-role', user.role, { expires: 7, path: '/' });
                set({ user, token, isAuthenticated: true });
            },
            logout: () => {
                localStorage.removeItem('auth-token');
                Cookies.remove('auth-token', { path: '/' });
                Cookies.remove('user-role', { path: '/' });
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
