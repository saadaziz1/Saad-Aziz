"use client";

import Link from "next/link";
import { Store, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useLogin } from "@/hooks/useLogin";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/lib/validation";

export default function LoginPage() {
    const { handleLogin, isLoading } = useLogin();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema)
    });

    return (
        <div className="min-h-screen bg-[#252836] flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-[#1F1D2B] border-none text-white p-8 space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-[#56363B] bg-opacity-40 rounded-2xl flex items-center justify-center text-primary">
                        <Store className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-muted-foreground text-sm">Please sign in to your account</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
                    <div className="space-y-2">
                        <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>Email Address</Label>
                        <Input
                            {...register("email")}
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            maxLength={255}
                            className={cn(
                                "bg-[#2D303E] border-gray-700 text-white h-12 focus:border-primary transition-all",
                                errors.email && "border-red-500 focus:border-red-500"
                            )}
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className={errors.password ? "text-red-500" : ""}>Password</Label>
                        <Input
                            {...register("password")}
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            maxLength={100}
                            className={cn(
                                "bg-[#2D303E] border-gray-700 text-white h-12 focus:border-primary transition-all",
                                errors.password && "border-red-500 focus:border-red-500"
                            )}
                        />
                        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold text-base mt-2 transition-all active:scale-[0.98]"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Sign In"}
                    </Button>
                </form>


            </Card>
        </div>
    );
}

import { cn } from "@/lib/utils";
