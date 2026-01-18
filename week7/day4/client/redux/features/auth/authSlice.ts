import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: any | null;
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: any; token: string }>
        ) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            localStorage.setItem('token', token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
