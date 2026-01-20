"use client";

import { useForm } from "react-hook-form";
import { useLoginMutation } from "../services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import useAuthRedirect from "../hooks/useAuthRedirect";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  useAuthRedirect();
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res: any = await login(data).unwrap();
      dispatch(setCredentials({ token: res.access_token }));
      router.push("/resumelist");
    } catch (err) {
      console.error(err);
    }
  };

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
          Build your resume. Build your future.
        </p>

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
          {...register("password", { required: "Password is required" })}
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-3">{errors.password.message}</p>
        )}

        {/* API Error */}
        {error && (
          <p className="text-red-500 text-sm mb-3">
            {(error as any)?.data?.message || "Login failed"}
          </p>
        )}

        {/* Social Login */}
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
            <span className="text-white font-medium">
              Continue with GitHub
            </span>
          </button>
        </div>
        */}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 mt-6 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold shadow-md transition"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
