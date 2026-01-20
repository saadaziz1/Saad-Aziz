"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      dispatch(setCredentials({ token }));
      localStorage.setItem("token", token);

      // Small delay for animation before redirect
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  }, [searchParams, dispatch, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center"
      >
        {/* Brand Title */}
        <motion.h1
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.2,
          }}
          className="text-3xl font-extrabold text-center mb-6 text-gray-900"
        >
          <span className="text-indigo-600">CareerCraft</span>
        </motion.h1>

        {/* Loading Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="mb-6"
        >
          <FaSpinner size={42} className="text-indigo-600" />
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-gray-600 text-center text-lg"
        >
          Signing you in securely...  
          <br />
          Please wait while we redirect you.
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="h-1 bg-indigo-600 rounded-full mt-6 w-full"
        />
      </motion.div>
    </div>
  );
}
