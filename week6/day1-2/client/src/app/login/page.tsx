"use client";

import React from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthSession } from "@/hooks/useAuthSession";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Link from "next/link";
import { loginSchema, LoginFormData } from '@/lib/validations/schemas';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const { handleLogin, isLoginLoading } = useAuthSession();

    const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await handleLogin(data);
            toast.success('Welcome back! 👋');
        } catch (err: any) {
            const message = err?.data?.message || "Login failed. Please check your credentials.";
            toast.error(message);
            setError('root', { message });
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-white">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div className="text-center">
                    <h2 className={cn(integralCF.className, "text-3xl font-bold tracking-tight text-black")}>
                        WELCOME BACK
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Enter your credentials to access your account
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {errors.root && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-100 flex items-center animate-shake">
                            {errors.root.message}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                autoComplete="email"
                                className={cn(
                                    "block w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-300",
                                    errors.email ? "border-red-500" : "border-gray-200"
                                )}
                                placeholder="yours@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                {...register('password')}
                                type="password"
                                autoComplete="current-password"
                                className={cn(
                                    "block w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-300",
                                    errors.password ? "border-red-500" : "border-gray-200"
                                )}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoginLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-full text-white bg-black hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all disabled:bg-gray-400"
                        >
                            {isLoginLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    SIGNING IN...
                                </span>
                            ) : (
                                "SIGN IN"
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-semibold text-black hover:underline underline-offset-4">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
