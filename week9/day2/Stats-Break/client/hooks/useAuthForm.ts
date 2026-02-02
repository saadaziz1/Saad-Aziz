"use client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { useLoginMutation, useRegisterMutation } from "@/services/authApi";

export const useAuthForm = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
    const [register, { isLoading: isRegisterLoading, error: registerError }] = useRegisterMutation();

    const handleLogin = async (data: any) => {
        try {
            const res: any = await login(data).unwrap();
            const roles = res.roles || ["user"];
            dispatch(setCredentials({ token: res.access_token, roles, user: res.user }));
            router.push("/");
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    const handleRegister = async (data: any) => {
        const { confirmPassword, ...payload } = data;
        try {
            await register(payload).unwrap();
            router.push("/login");
        } catch (err) {
            console.error("Registration failed:", err);
        }
    };

    return {
        handleLogin,
        handleRegister,
        isLoginLoading,
        isRegisterLoading,
        loginError,
        registerError,
    };
};
