"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

import { AuthResponse } from "../../../types";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoginLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = () => {
    setError("");
    
    login({ email, password }, {
      onSuccess: (data: AuthResponse) => {
        // Redirect admin users to admin dashboard
        if (data.user.role === 'SUPER_ADMIN') {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      },
      onError: (err: any) => {
        setError(err?.response?.data?.message || err?.message || "Login failed");
      }
    });
  };

  return (
    <div className=" flex items-center justify-center px-4 my-40">
      <Card className="w-full max-w-md p-8 bg-[#1A1A1A] border-[#262626]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
          <p className="text-gray-400">Welcome back to StreamFlix</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#141414] border border-[#262626] rounded-md text-white focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#141414] border border-[#262626] rounded-md text-white focus:outline-none focus:border-red-500"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoginLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold disabled:opacity-50"
          >
            {isLoginLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-red-500 hover:text-red-400">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;