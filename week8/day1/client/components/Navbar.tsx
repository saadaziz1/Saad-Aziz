"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { FiLogIn, FiUserPlus, FiLogOut, FiBriefcase } from "react-icons/fi";
import { logout } from "../features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector((state: any) => state.auth.token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link href="/">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-200 group-hover:shadow-emerald-300 transition-all duration-300 group-hover:scale-110">
              <FiBriefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Resume Builder
              </h1>
              <p className="text-xs text-slate-500 font-medium">Build Your Future</p>
            </div>
          </motion.div>
        </Link>

        <nav className="flex items-center gap-3">
          {mounted && token ? (
            <>
              <Link
                href="/resumelist"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors duration-200"
              >
                My Resumes
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold shadow-lg shadow-red-200 hover:shadow-red-300 hover:from-red-600 hover:to-pink-700 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-emerald-700 font-semibold hover:bg-emerald-50 transition-all duration-200"
              >
                <FiLogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:from-emerald-600 hover:to-teal-700 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <FiUserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
