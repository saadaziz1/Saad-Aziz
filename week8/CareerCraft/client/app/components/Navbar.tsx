"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { FiLogIn, FiUserPlus, FiLogOut } from "react-icons/fi";
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
    <header className="flex justify-between items-center px-8 py-4 shadow-sm bg-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-extrabold text-indigo-600"
      >
        <Link href="/">CareerCraft</Link>
      </motion.h1>

      <div className="flex items-center gap-4">
        {mounted && token ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            <FiLogOut />
            Logout
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              <FiLogIn />
              Login
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 transition"
            >
              <FiUserPlus />
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
