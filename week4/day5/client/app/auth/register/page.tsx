"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register, isRegisterLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = () => {
    setError("");

    register({ name, email, password }, {
      onSuccess: () => {
        router.push("/auth/login");
      },
      onError: (err: any) => {
        setError(err?.response?.data?.message || err?.message || "Registration failed");
      }
    });
  };

  return (
    <div className="flex items-center justify-center px-4 mt-30 mb-20">
      <Card className="w-full max-w-md p-8 bg-[#1A1A1A] border-[#262626]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sign Up</h1>
          <p className="text-gray-400">Create your StreamFlix account</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#141414] border border-[#262626] rounded-md text-white focus:outline-none focus:border-red-500"
              required
            />
          </div>

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
            disabled={isRegisterLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold disabled:opacity-50"
          >
            {isRegisterLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-red-500 hover:text-red-400">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;