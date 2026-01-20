import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string;}>
    ) => {
      state.token = action.payload.token;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
      }

      console.log("🔑 User logged in:", state.token);
    },
    logout: (state) => {
      state.token = null;


      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
