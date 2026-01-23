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

const setCookie = (name: string, value: string, days: number = 7) => {
    if (typeof window === 'undefined') return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
    if (typeof window === 'undefined') return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const getCookie = (name: string) => {
    if (typeof window === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

const initialState: AuthState = {
    token: getSafeItem('token') || getCookie('token'),
    user: (() => {
        const item = getSafeItem('user');
        if (!item) return null;
        try {
            return JSON.parse(item);
        } catch (e) {
            return null;
        }
    })(),
    isAuthenticated: !!(getSafeItem('token') || getCookie('token')),
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
            setCookie('token', access_token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            deleteCookie('token');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
