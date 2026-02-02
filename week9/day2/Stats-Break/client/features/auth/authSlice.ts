import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  user: any | null;
  roles?: string[] | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  roles: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user?: any; roles?: string[] }>
    ) => {
      const { token } = action.payload;

      // Guard against invalid tokens
      if (!token || token === "undefined" || token === "null") return;

      state.token = token;
      state.user = action.payload.user || null;
      state.roles = action.payload.roles || null;

      // persist in localStorage and cookies
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(action.payload.user || null));
        localStorage.setItem("roles", JSON.stringify(action.payload.roles || null));
        document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.roles = null;

      // remove from localStorage and cookies
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("roles");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      }
    },
    hydrate: (state) => {
      if (typeof window !== "undefined") {
        state.token = localStorage.getItem("token");
        state.user = JSON.parse(localStorage.getItem("user") || "null");
        state.roles = JSON.parse(localStorage.getItem("roles") || "null");
      }
    },
  },
});

export const { setCredentials, logout, hydrate } = authSlice.actions;
export default authSlice.reducer;
