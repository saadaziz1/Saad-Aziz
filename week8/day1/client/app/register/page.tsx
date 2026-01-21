"use client";

import { useForm } from "react-hook-form";
import { useRegisterMutation } from "@/services/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import toast from "react-hot-toast";

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
      await registerUser(payload).unwrap();
      toast.success("Account created successfully!");
      router.push('/login');
    } catch (err: any) {
      console.error("Registration Error Detected:", JSON.stringify(err, null, 2));
      const message = err?.data?.message || "Registration failed";
      toast.error(message);
      if (message?.includes("not verified")) {
        router.push('/login');
      }
    }
  };

  const password = watch("password");

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50">
      {/* visual side */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white p-12 relative overflow-hidden animate-gradient">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10 max-w-lg text-center animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            Join the  <br /> Professionals
          </h1>
          <p className="text-xl text-emerald-50 leading-relaxed">
            Start building your career today. Our smart resume builder helps you craft the perfect resume to land your dream job.
          </p>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-60 h-60 bg-cyan-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-300 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 animate-fade-in-up">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 mt-2">Sign up to get started.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                {...register("name", { required: "Name is required" })}
                className="input-field"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email", { required: "Email is required" })}
                className="input-field"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                className="input-field"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                className="input-field"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                {(error as any)?.data?.message || "Registration failed"}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold shadow-lg shadow-emerald-200 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-center text-sm text-gray-600 pt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-600 font-semibold hover:text-emerald-800 transition">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
