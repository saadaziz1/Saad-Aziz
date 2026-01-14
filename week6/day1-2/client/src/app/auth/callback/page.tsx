"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useGetMeQuery } from "@/api/authApi";
import toast from "react-hot-toast";

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const { setAuth } = useAuthStore();

    // Use the token from URL to fetch user data
    const { data: userData, isSuccess, isError, error } = useGetMeQuery(token || undefined, {
        skip: !token,
    });

    useEffect(() => {
        if (!token) {
            toast.error("Authentication failed. No token received.");
            router.push("/login");
            return;
        }

        if (isSuccess && userData) {
            setAuth(userData, token);
            toast.success("Welcome back! 👋");
            router.push("/dashboard");
        }

        if (isError) {
            console.error("Failed to fetch user profile:", error);
            toast.error("Failed to sync your profile. Please try again.");
            router.push("/login");
        }
    }, [token, isSuccess, userData, isError, error, router, setAuth]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            <p className="text-gray-500 font-medium">Finalizing your login...</p>
        </div>
    );
}
