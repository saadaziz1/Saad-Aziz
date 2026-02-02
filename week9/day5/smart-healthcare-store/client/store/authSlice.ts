import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload.token);
            // We also set a cookie for middleware access
            document.cookie = `auth_token=${action.payload.token}; path=/; max-age=86400; SameSite=Strict`;
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            document.cookie = 'auth_token=; path=/; max-age=0';
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
