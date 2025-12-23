"use client";

import { useState } from "react";
import { Header, CommentForm, CommentsList, LoadingSpinner, LoginForm, RegisterForm, UsersList } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";

export default function Home() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isLoading: socketLoading } = useSocket();

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-4 px-4 sm:py-8 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          {isLoginMode ? (
            <LoginForm onToggleMode={() => setIsLoginMode(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLoginMode(true)} />
          )}
        </div>
      </div>
    );
  }

  if (socketLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl p-6 sm:p-8 animate-fade-in">
              <CommentForm />
              <CommentsList />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UsersList />
          </div>
        </div>

        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Built with Next.js, NestJS, Socket.IO, and MongoDB</p>
        </div>
      </div>
    </div>
  );
}
