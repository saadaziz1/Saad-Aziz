import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { useLoginMutation, useRegisterMutation } from "@/services/authApi";
import { toast } from "react-hot-toast";

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
            toast.success("SYSTEM ACCESS GRANTED");
            router.push("/");
        } catch (err: any) {
            const message = err.data?.message || "ACCESS DENIED: INVALID CREDENTIALS";
            toast.error(message.toUpperCase());
            console.error("Login failed:", err);
        }
    };

    const handleRegister = async (data: any) => {
        const { confirmPassword, ...payload } = data;
        try {
            await register(payload).unwrap();
            toast.success("NEW USER INITIALIZED: PLEASE LOGIN");
            router.push("/login");
        } catch (err: any) {
            const message = err.data?.message || "INITIALIZATION FAILED";
            toast.error(message.toUpperCase());
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
