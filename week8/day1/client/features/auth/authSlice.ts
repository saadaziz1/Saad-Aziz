import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
}

// Helper to get cookie
const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'
  ));
  return matches ? decodeURIComponent(matches[1]) : null;
};

// Helper to set cookie
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

// Helper to delete cookie
const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const initialState: AuthState = {
  token: typeof window !== "undefined" ? (getCookie("token") || localStorage.getItem("token")) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; }>
    ) => {
      state.token = action.payload.token;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        setCookie("token", action.payload.token, 7); // Cookie expires in 7 days
      }

      console.log("🔑 User logged in:", state.token);
    },
    logout: (state) => {
      state.token = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        deleteCookie("token");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
