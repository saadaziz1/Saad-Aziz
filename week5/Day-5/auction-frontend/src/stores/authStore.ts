import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user: User, token: string) => {
        console.log('[AuthStore] Setting auth:', { user, token });
        // Sync token to cookie for middleware
        if (typeof document !== 'undefined') {
          // Expires in 1 day
          document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
        }
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        console.log('[AuthStore] Logging out');
        // Remove cookie for middleware
        if (typeof document !== 'undefined') {
          document.cookie = `auth_token=; path=/; max-age=0; SameSite=Lax`;
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          set({ user: updatedUser });
        }
      },
    }),
    {
      name: 'auth-storage', // key for localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('[AuthStore] Rehydrated state:', state);
      },
    }
  )
);
