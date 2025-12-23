"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  User,
  LogOut,
  
  X,
  LayoutDashboard,
} from "lucide-react";
import { NavItems } from "../constants";
import { useAuthStore } from "@/lib/authStore";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const router = useRouter();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-370 3xl:max-w-450 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/Logo.png" alt="Logo" className="h-fit 3xl:h-15" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0F0F0F] rounded-lg p-2 3xl:p-3.5 w-[412px] 3xl:w-[555px] border border-[#1F1F1F]">
          {NavItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className="text-white text-sm 3xl:text-lg p-3 h-[45px] 3xl:h-[55px] rounded-md hover:bg-[#1F1F1F]"
            >
              {item.text}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Icons */}
        <div className="hidden md:flex items-center gap-4 relative">
          {isAuthenticated ? (
            <>
              <Search className="3xl:w-8 3xl:h-8 w-5 h-5 text-white cursor-pointer" />
              <Bell className="3xl:w-8 3xl:h-8 w-5 h-5 text-white cursor-pointer" />

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="text-white hover:text-gray-300"
                >
                  <User className="3xl:w-8 3xl:h-8 w-5 h-5" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 3xl:w-52 bg-[#0F0F0F] text-sm 3xl:text-lg border border-[#1F1F1F] rounded-lg shadow-lg">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-3  text-white hover:bg-[#1F1F1F]"
                    >
                      <User className="3xl:w-8 3xl:h-8 w-5 h-5" />
                      Profile
                    </Link>

                    <Link
                      href="/admin/dashboard"
                      className="flex items-center gap-2 px-4 py-3  text-white hover:bg-[#1F1F1F]"
                    >
                      <LayoutDashboard className="3xl:w-8 3xl:h-8 w-5 h-5" />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3  text-red-400 hover:bg-[#1F1F1F]"
                    >
                      <LogOut className="3xl:w-8 3xl:h-8 w-5 h-5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Button onClick={handleLogin} className="bg-red-600 hover:bg-red-700">
              Login
            </Button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(true)}
        >
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M0 0.75C0 0.335786 0.335786 0 0.75 0H17.25C17.6642 0 18 0.335786 18 0.75C18 1.16421 17.6642 1.5 17.25 1.5H0.75C0.335786 1.5 0 1.16421 0 0.75ZM0 6C0 5.58579 0.335786 5.25 0.75 5.25H17.25C17.6642 5.25 18 5.58579 18 6C18 6.41421 17.6642 6.75 17.25 6.75H0.75C0.335786 6.75 0 6.41421 0 6ZM8.25 11.25C8.25 10.8358 8.58579 10.5 9 10.5H17.25C17.6642 10.5 18 10.8358 18 11.25C18 11.6642 17.6642 12 17.25 12H9C8.58579 12 8.25 11.6642 8.25 11.25Z" fill="white"/>
</svg>

        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-[#0F0F0F] z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex justify-between items-center border-b border-[#1F1F1F]">
          <span className="text-white font-semibold">Menu</span>
          <X
            className="w-5 h-5 text-white cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>

        <div className="p-6 space-y-4">
          {NavItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white text-sm py-2"
            >
              {item.text}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-white py-2"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>

              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-white py-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400 py-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <Button onClick={handleLogin} className="w-full bg-red-600">
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
