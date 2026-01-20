"use client";

import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../services/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import useAuthRedirect from "../hooks/useAuthRedirect";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  useAuthRedirect();
  const router = useRouter();
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      const { confirmPassword, ...payload } = data;
      const response = await registerUser(payload).unwrap();
      // router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      router.push('/login');
    } catch (err: any) {
      console.error("Registration Error Detected:", JSON.stringify(err, null, 2));
      console.error("Raw Error:", err);

      const message = err?.data?.message;
      if (message?.includes("not verified")) {
        // router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        router.push('/login');
      }
    }
  };

  const password = watch("password");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100"
      >
        {/* Brand Title */}
        <h1 className="text-4xl font-extrabold text-center mb-2 text-indigo-600">
          CareerCraft
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Create your account to start building resumes.
        </p>

        {/* Name */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          placeholder="John Doe"
          {...register("name", { required: "Name is required" })}
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mb-3">{errors.name.message}</p>
        )}

        {/* Email */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          {...register("email", { required: "Email is required" })}
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>
        )}

        {/* Password */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters" },
          })}
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-3">{errors.password.message}</p>
        )}

        {/* Confirm Password */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          {...register("confirmPassword", {
            required: "Confirm Password is required",
            validate: (value) => value === password || "Passwords do not match",
          })}
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-3">
            {errors.confirmPassword.message}
          </p>
        )}

        {/* API Error */}
        {error && (
          <p className="text-red-500 text-sm mb-3">
            {(error as any)?.data?.message || "Registration failed"}
          </p>
        )}

        {/* Social Auth */}
        {/*
        <div className="flex flex-col gap-3 mt-4">
          <button
            type="button"
            onClick={() => {
              window.location.href = `${process.env.NEXT_PUBLIC_SERVER}auth/google`;
            }}
            className="w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition shadow-sm"
          >
            <FcGoogle size={22} />
            <span className="text-gray-700 font-medium">
              Continue with Google
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = `${process.env.NEXT_PUBLIC_SERVER}auth/github`;
            }}
            className="w-full flex items-center justify-center gap-3 p-3 border border-gray-800 rounded-lg bg-gray-900 hover:bg-gray-800 transition shadow-sm"
          >
            <FaGithub size={22} className="text-white" />
            <span className="text-white font-medium">Continue with GitHub</span>
          </button>
        </div>
        */}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 mt-6 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold shadow-md transition"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        {/* Already have an account */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
