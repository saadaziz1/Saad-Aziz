import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'teacher' | 'moderator';
    rollNumber?: string;
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
                Cookies.set('token', token, { expires: 7 });
                Cookies.set('user_role', user.role, { expires: 7 });
                set({ user, token, isAuthenticated: true });
            },
            logout: () => {
                Cookies.remove('token');
                Cookies.remove('user_role');
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
