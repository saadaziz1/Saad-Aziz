"use client";
import { BarChart3, LogOut, Zap, Users, Activity } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useRouter } from "next/navigation";
import { chatApi } from "../services/chatApi";
import { authApi } from "../services/authApi";

// Enhanced ChatHeader with animated elements
export default function ChatHeader() {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className="relative mb-8">
      <div className="panel-header font-bold ml-4">SYSTEM INTERFACE v2.0</div>
      <div className="pixel-box flex flex-col md:flex-row items-center justify-between gap-6 border-cyan-400 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="relative">
            <div className="bg-cyan-500 p-3 sm:p-4 border-2 border-white shadow-[0_0_15px_rgba(45,226,230,0.5)]">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 border-2 border-white animate-pulse shadow-[0_0_10px_#f6019d]"></div>
          </div>

          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl lg:text-3xl font-black pixel-font text-cyan-400 glow-text-cyan glitch">
              CRIC STATS AI
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-[8px] sm:text-[10px] pixel-font text-purple-400">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-pink-500" />
                NEURAL LINK ACTIVE
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" />
                DATA PROCESSOR ONLINE
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            dispatch(logout());
            dispatch(chatApi.util.resetApiState());
            dispatch(authApi.util.resetApiState());
            router.push("/login");
          }}
          className="pixel-btn pixel-btn-magenta w-full sm:w-auto px-8 py-3"
        >
          <LogOut className="w-4 h-4" />
          TERMINATE SESSION
        </button>
      </div>
    </div>
  );
}
