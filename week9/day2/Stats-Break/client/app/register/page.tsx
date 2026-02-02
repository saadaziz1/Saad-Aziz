"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import CRTLayout from "@/components/layout/CRTLayout";
import { useAuthForm } from "@/hooks/useAuthForm";

type RegisterForm = { name: string; email: string; password: string; confirmPassword: string };

export default function Register() {
  const { handleRegister, isRegisterLoading: isLoading, registerError: error } = useAuthForm();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const password = watch("password");

  return (
    <CRTLayout className="flex items-center justify-center px-4">
      <div className="flex flex-col w-full max-w-md">
        <div className="panel-header !bg-magenta-600 ml-4 font-bold uppercase">Node Registration v2.0</div>
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="pixel-box pixel-box-magenta !bg-panel p-6 sm:p-10 shadow-[0_0_30px_rgba(246,1,157,0.15)]"
        >
          <h1 className="text-xl font-bold text-center mb-10 pixel-font text-pink-500 glow-text-magenta glitch">
            INITIALIZE SYNC
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-[8px] pixel-font text-purple-400 mb-1">OPERATOR NAME</label>
              <input
                type="text"
                placeholder="NAME STORAGE"
                {...register("name", { required: "Name is required" })}
                className="pixel-input"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-[8px] pixel-font text-purple-400 mb-1">COMMS LINK</label>
              <input
                type="email"
                placeholder="EMAIL AT NODE NET"
                {...register("email", { required: "Email is required" })}
                className="pixel-input"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-[8px] pixel-font text-purple-400 mb-1">CYPHER ACCESS</label>
              <input
                type="password"
                placeholder="********"
                {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 chars" } })}
                className="pixel-input"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-[8px] pixel-font text-purple-400 mb-1">VERIFY CYPHER</label>
              <input
                type="password"
                placeholder="********"
                {...register("confirmPassword", { required: "Required", validate: (v) => v === password || "Mismatch" })}
                className="pixel-input"
                maxLength={50}
              />
            </div>
          </div>

          {error && (
            <p className="text-pink-600 text-[8px] pixel-font mt-4">
              ERROR {(error as any)?.data?.message || "SYNC FAILED"}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="pixel-btn pixel-btn-magenta w-full py-4 mt-8"
          >
            {isLoading ? "UPLOADING CREDENTIALS..." : "ESTABLISH NODE LINK"}
          </button>

          <p className="text-center text-[8px] pixel-font text-pink-900 mt-6 lowercase">
            ALREADY UPLINKED?{" "}
            <Link href="/login" className="text-cyan-400 hover:text-white transition-colors">
              [RETURN TO TERMINAL]
            </Link>
          </p>
        </form>
      </div>
    </CRTLayout>
  );
}
