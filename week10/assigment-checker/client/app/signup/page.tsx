"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const signupSchema = z.object({
    firstName: z.string().min(1, "First name is required").min(2, "First name is too short").max(50, "First name is too long"),
    lastName: z.string().min(1, "Last name is required").min(2, "Last name is too short").max(50, "Last name is too long"),
    email: z.string().min(1, "Email is required").email("Invalid university email"),
    password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
    agree: z.boolean().refine((val) => val === true, "You must agree to the terms"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
    const { signup, isSigningUp, signupError } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = (data: SignupFormValues) => {
        // Everyone signs up as student initially
        const { agree, ...rest } = data;
        signup({ ...rest, role: "student" });
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <div className="z-10 w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center space-x-2 text-primary font-black text-2xl tracking-tighter mb-4">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">A</div>
                        <span>AssignCheck</span>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Create an Account</h1>
                    <p className="text-foreground/60 font-medium tracking-tight">Join 500+ educators streamlining academic grading.</p>
                </div>

                <div className="glass p-8 md:p-10 rounded-4xl space-y-6 shadow-2xl border border-white/5">
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                label="First Name"
                                id="firstName"
                                placeholder="John"
                                registration={register("firstName")}
                                error={errors.firstName?.message}
                            />
                            <FormField
                                label="Last Name"
                                id="lastName"
                                placeholder="Doe"
                                registration={register("lastName")}
                                error={errors.lastName?.message}
                            />
                        </div>
                        <FormField
                            label="University Email"
                            id="email"
                            type="email"
                            placeholder="name@university.edu"
                            registration={register("email")}
                            error={errors.email?.message}
                        />
                        <FormField
                            label="Password"
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            registration={register("password")}
                            error={errors.password?.message}
                        />

                        <div className="pt-2">
                            <label className="flex items-start space-x-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center mt-1">
                                    <input
                                        type="checkbox"
                                        className="peer hidden"
                                        {...register("agree")}
                                    />
                                    <div className={`w-5 h-5 rounded-md border-2 ${errors.agree ? "border-danger bg-danger/5" : "border-white/10 bg-white/5"} peer-checked:bg-primary peer-checked:border-primary transition-all`}></div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute w-3.5 h-3.5 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-foreground/40 font-medium leading-relaxed group-hover:text-foreground/60 transition-colors">
                                        I agree to the <span className="text-primary hover:underline">Terms of Service</span> and <span className="text-primary hover:underline">Privacy Policy</span>.
                                    </p>
                                    {errors.agree && <p className="text-[10px] font-bold text-danger uppercase tracking-widest">{errors.agree.message}</p>}
                                </div>
                            </label>
                        </div>

                        {signupError && (
                            <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-bold text-center">
                                {(signupError as any)?.response?.data?.message || "Something went wrong. Please try again."}
                            </div>
                        )}

                        <Button fullWidth size="lg" className="mt-4" type="submit" disabled={isSigningUp}>
                            {isSigningUp ? "Creating Account..." : "Get Started Free"}
                        </Button>
                    </form>
                </div>

                <p className="text-center text-sm text-foreground/40 font-medium">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-bold hover:underline transition-all">Sign in</Link>
                </p>
            </div>
        </main>
    );
}
