"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "../services/authApi";
import { useState } from "react";
import Link from "next/link";

type OtpForm = {
  otp: string;
};

export default function VerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [verifyOtp, { isLoading: verifying, error: verifyError }] =
    useVerifyOtpMutation();
  const [resendOtp, { isLoading: resending, error: resendError }] =
    useResendOtpMutation();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpForm>();

  const onSubmit = async (data: OtpForm) => {
    try {
      await verifyOtp({ email, otp: data.otp }).unwrap();
      setSuccessMessage("✅ OTP verified! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      console.error("OTP verification failed", err);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email }).unwrap();
      setSuccessMessage("📩 A new OTP has been sent to your email!");
    } catch (err) {
      console.error("Resend OTP failed", err);
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
        <h2 className="text-lg mb-6 text-center text-gray-700 font-medium">
          Verify Your OTP
        </h2>

        {/* Instruction */}
        <p className="text-gray-600 text-sm mb-4 text-center">
          We’ve sent a one-time password to{" "}
          <span className="font-semibold text-indigo-600">{email}</span>.
          <br />
          Please enter it below to continue.
        </p>

        {/* OTP Input */}
        <input
          type="text"
          placeholder="Enter OTP"
          {...register("otp", { required: "OTP is required" })}
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center tracking-widest font-mono text-lg"
        />
        {errors.otp && (
          <p className="text-red-500 text-sm mb-3">{errors.otp.message}</p>
        )}

        {/* Errors */}
        {verifyError && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {(verifyError as any)?.data?.message || "OTP verification failed"}
          </p>
        )}
        {resendError && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {(resendError as any)?.data?.message || "Failed to resend OTP"}
          </p>
        )}

        {/* Success */}
        {successMessage && (
          <p className="text-green-600 text-sm mb-3 text-center font-medium">
            {successMessage}
          </p>
        )}

        {/* Buttons */}
        <button
          type="submit"
          disabled={verifying}
          className="w-full p-3 mt-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold shadow-md transition"
        >
          {verifying ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="w-full p-3 mt-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 font-medium transition"
        >
          {resending ? "Resending..." : "Resend OTP"}
        </button>

        {/* Back to Login */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Already verified?{" "}
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
