"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
    const { login, isLoading, error: authError } = useAuth();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormValues) => {
        login(data);
    };

    const fillDemo = (role: 'teacher' | 'student' | 'moderator') => {
        let email = '';
        if (role === 'teacher') email = 'teacher@demo.com';
        else if (role === 'moderator') email = 'moderator@demo.com';
        else email = 'student@demo.com';

        setValue('email', email);
        setValue('password', 'password123');
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <div className="z-10 w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center space-x-2 text-primary font-black text-2xl tracking-tighter mb-4">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">A</div>
                        <span>AssignCheck</span>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
                    <p className="text-foreground/60 font-medium tracking-tight">Elevate your academic workflow with AI.</p>
                </div>

                <div className="glass p-8 md:p-10 rounded-4xl space-y-6 shadow-2xl border border-white/5">
                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <FormField
                            label="Email address"
                            id="email"
                            type="email"
                            placeholder="name@university.edu"
                            registration={register("email")}
                            error={errors.email?.message}
                        />
                        <div className="space-y-1">
                            <FormField
                                label="Password"
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                registration={register("password")}
                                error={errors.password?.message}
                            />
                            <div className="flex justify-end px-1">
                                <button type="button" className="text-xs font-bold text-primary hover:underline transition-all">Forgot password?</button>
                            </div>
                        </div>

                        {authError && (
                            <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-bold text-center animate-in fade-in zoom-in-95">
                                {(authError as any)?.response?.data?.message || "Invalid credentials. Please try again."}
                            </div>
                        )}

                        <Button fullWidth size="lg" className="mt-4" type="submit" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-white/20">
                            <span className="bg-background px-4">Try Demo Accounts</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => fillDemo('teacher')}
                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/30 transition-all group"
                        >
                            <span className="text-xl mb-1">👨‍🏫</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 group-hover:text-primary transition-colors text-center">Teacher</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemo('student')}
                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-secondary/30 transition-all group"
                        >
                            <span className="text-xl mb-1">🎓</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 group-hover:text-secondary transition-colors text-center">Student</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemo('moderator')}
                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-accent/30 transition-all group"
                        >
                            <span className="text-xl mb-1">🛡️</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 group-hover:text-accent transition-colors text-center">Moderator</span>
                        </button>
                    </div>
                </div>

                <p className="text-center text-sm text-foreground/40 font-medium">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-primary font-bold hover:underline">Create account</Link>
                </p>
            </div>
        </main>
    );
}
