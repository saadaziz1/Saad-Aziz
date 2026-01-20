import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    user: any | null;
    isAuthenticated: boolean;
}

const getSafeItem = (key: string) => {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(key);
    if (!item || item === 'undefined') return null;
    return item;
};

const initialState: AuthState = {
    token: getSafeItem('token'),
    user: (() => {
        const item = getSafeItem('user');
        if (!item) return null;
        try {
            return JSON.parse(item);
        } catch (e) {
            return null;
        }
    })(),
    isAuthenticated: !!getSafeItem('token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: any; access_token: string }>
        ) => {
            const { user, access_token } = action.payload;
            state.user = user;
            state.token = access_token;
            state.isAuthenticated = true;
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
