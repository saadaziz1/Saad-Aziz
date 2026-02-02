"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import CRTLayout from "@/components/layout/CRTLayout";
import { useAuthForm } from "@/hooks/useAuthForm";

type LoginForm = { email: string; password: string };

export default function Login() {
  const { handleLogin, isLoginLoading: isLoading, loginError: error } = useAuthForm();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  return (
    <CRTLayout className="flex items-center justify-center px-4">
      <div className="flex flex-col w-full max-w-md">
        <div className="panel-header !bg-cyan-500 ml-4 font-bold uppercase">Auth Portal v2.0</div>
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="pixel-box border-cyan-400 !bg-panel p-6 sm:p-10 shadow-[0_0_30px_rgba(45,226,230,0.15)]"
        >
          <h1 className="text-xl font-bold text-center mb-10 pixel-font text-cyan-400 glow-text-cyan glitch">
            TERMINAL LOGIN
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-[8px] pixel-font text-purple-400 mb-2">IDENTIFIER LINK</label>
              <input
                type="email"
                placeholder="USER@CORE.NET"
                {...register("email", { required: "Required" })}
                className="pixel-input"
                maxLength={100}
              />
              {errors.email && <p className="text-pink-500 text-[8px] pixel-font mt-2">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[8px] pixel-font text-purple-400 mb-2">ACCESS CYPHER</label>
              <input
                type="password"
                placeholder="********"
                {...register("password", { required: "Required" })}
                className="pixel-input"
                maxLength={50}
              />
              {errors.password && <p className="text-pink-500 text-[8px] pixel-font mt-2">{errors.password.message}</p>}
            </div>
          </div>

          {error && (
            <p className="text-pink-600 text-[10px] pixel-font mt-6 text-center animate-pulse">
              ERROR {(error as any)?.data?.message || "ACCESS DENIED"}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="pixel-btn w-full py-4 mt-8"
          >
            {isLoading ? "ESTABLISHING..." : "EXEC LOGIN PROCESS"}
          </button>

          <div className="flex items-center gap-4 mt-10 opacity-60">
            <div className="h-[2px] flex-1 bg-cyan-900"></div>
            <p className="text-[8px] pixel-font text-purple-400">OR</p>
            <div className="h-[2px] flex-1 bg-cyan-900"></div>
          </div>

          <p className="text-center text-[10px] pixel-font text-cyan-900 mt-6 lowercase">
            NEW OPERATOR?{" "}
            <Link href="/register" className="text-pink-500 hover:text-white transition-colors">
              [REGISTER CORE]
            </Link>
          </p>
        </form>
      </div>
    </CRTLayout>
  );
}
