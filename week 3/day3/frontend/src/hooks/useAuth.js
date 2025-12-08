import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api";
import { setToken } from "../utils/auth";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (data) => {
    setLoading(true);
    setError('');
    const res = await loginUser(data);
    setLoading(false);

    if (res.token) {
      setToken(res.token);
      navigate("/dashboard");
      return { success: true };
    }
    setError(res.msg || "Login failed");
    return { success: false, message: res.msg || "Login failed" };
  };

  const register = async (data) => {
    setLoading(true);
    setError('');
    const res = await registerUser(data);
    setLoading(false);

    if (res.token) {
      navigate("/");
      return { success: true };
    }

    setError(res.msg || "Registration failed");
    return { success: false, message: res.msg || "Registration failed" };
  };

  return { login, register, loading, error };
};
