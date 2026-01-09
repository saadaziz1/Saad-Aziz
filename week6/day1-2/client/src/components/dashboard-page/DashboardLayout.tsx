//dashboard-layout.tsx
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboard } from "@/hooks/useDashboard";
import { useProductsStore } from "@/store/useProductsStore";

import {
  Search,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ChevronRight,
  Menu,
  X,
  Loader2
} from "lucide-react";

import { cn } from "@/lib/utils";
import DashboardProfileDropdown from "./DashboardProfileDropdown";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

import { useRouter } from "next/navigation";

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { categories, types, profile, isLoadingProfile } = useDashboard();
  const { category: currentCategory, setCategory, type: currentType, setType } = useProductsStore();
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [typesOpen, setTypesOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);



  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#E5E5E5]">
        <Loader2 className="w-10 h-10 animate-spin text-[#003B5C]" />
      </div>
    );
  }



  const navigation = [
    { name: "DASHBOARD", href: "/dashboard", icon: LayoutDashboard },
    { name: "ALL PRODUCTS", href: "/dashboard/products", icon: Package },
    { name: "ORDER LIST", href: "/dashboard/orders", icon: ShoppingCart },
  ];

  if (profile?.role === 'SUPER_ADMIN') {
    navigation.push({ name: "USERS", href: "/dashboard/users", icon: Users });
  }

  const SidebarContent = () => (
    <>
      {/* Logo Area */}
      <div className="p-6 mb-2">
        <div className="flex items-center space-x-2">
          <div className="flex items-baseline">
            <span className="text-2xl font-black text-[#003B5C] italic">Arik</span>
            <div className="ml-1 w-6 h-4 bg-gray-400 opacity-30 rounded-full rotate-12 flex items-center justify-center">
              <div className="w-4 h-2 bg-white rounded-full opacity-50" />
            </div>
          </div>
        </div>
      </div>

      <nav className="px-3 space-y-1 ">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center px-4 py-3 rounded-md text-[11px] font-bold transition-colors tracking-wider",
                isActive
                  ? "bg-[#003B5C] text-white shadow-md"
                  : "text-[#6B7280] hover:bg-gray-50"
              )}
            >
              <Icon className="w-4 h-4 mr-3" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Categories Section */}
      <div className="mt-8 px-4">
        <button
          onClick={() => setCategoriesOpen(!categoriesOpen)}
          className="flex items-center justify-between w-full px-3 py-2 text-[12px] font-bold text-gray-900"
        >
          <span>Categories</span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", !categoriesOpen && "-rotate-90")} />
        </button>
        {categoriesOpen && (
          <div className="mt-2 space-y-1">
            {categories.map((cat: any, i: number) => {
              const isSelected = currentCategory === cat.name;
              return (
                <div
                  key={i}
                  onClick={() => {
                    setCategory(isSelected ? "" : cat.name);
                    if (pathname !== "/dashboard/products") router.push("/dashboard/products");
                  }}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-[11px] rounded cursor-pointer group transition-all",
                    isSelected
                      ? "bg-[#003B5C] text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  )}
                >
                  <span className="capitalize">{cat.name.replace(/-/g, " ")}</span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold transition-colors",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 group-hover:bg-[#003B5C] group-hover:text-white"
                    )}
                  >
                    {cat.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Types Section */}
      <div className="mt-4 px-4 pb-8">
        <button
          onClick={() => setTypesOpen(!typesOpen)}
          className="flex items-center justify-between w-full px-3 py-2 text-[12px] font-bold text-gray-900"
        >
          <span>Types</span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", !typesOpen && "-rotate-90")} />
        </button>
        {typesOpen && (
          <div className="mt-2 space-y-1">
            {types.map((type: any, i: number) => {
              const isSelected = currentType === type.name;
              return (
                <div
                  key={i}
                  onClick={() => {
                    setType(isSelected ? "" : type.name);
                    if (pathname !== "/dashboard/products") router.push("/dashboard/products");
                  }}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-[11px] rounded cursor-pointer group transition-all",
                    isSelected
                      ? "bg-[#003B5C] text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  )}
                >
                  <span className="capitalize">{type.name.replace(/-/g, " ")}</span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold transition-colors",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 group-hover:bg-[#003B5C] group-hover:text-white"
                    )}
                  >
                    {type.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="bg-[#E5E5E5] min-h-screen font-sans">
      <div className="flex relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block bg-white h-screen sticky top-0 w-64 border-r border-gray-200 z-40 overflow-y-auto hide-scrollbar">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobile && mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar Drawer */}
        <aside className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white z-60 lg:hidden transition-transform duration-300 ease-in-out overflow-y-auto hide-scrollbar",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex justify-end p-4">
            <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile and Desktop Unified Header */}
          <header className="bg-white h-16 lg:h-20 border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
            <div className="flex items-center">
              <button
                className="lg:hidden p-2 -ml-2 mr-2 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div className="hidden sm:flex items-center space-x-2 lg:hidden">
                <span className="text-xl font-black text-[#003B5C] italic">Arik</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 lg:space-x-6">
              <button className="p-2 text-gray-400 hover:text-[#003B5C] transition-colors rounded-full hover:bg-gray-50">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-[#003B5C] transition-colors relative rounded-full hover:bg-gray-50">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
              </button>
              <DashboardProfileDropdown />
            </div>
          </header>

          <main className="p-4 lg:p-8 flex-1">
            {children}
          </main>

          <footer className="p-4 lg:p-8 pt-0 flex flex-col sm:flex-row justify-between items-center text-[9px] lg:text-[10px] text-gray-400 uppercase tracking-widest font-medium gap-4">
            <div>© 2026 - Arik Dashboard</div>
            <div className="flex space-x-4 lg:space-x-6">
              <span className="hover:text-gray-600 cursor-pointer transition-colors">About</span>
              <span className="hover:text-gray-600 cursor-pointer transition-colors">Careers</span>
              <span className="hover:text-gray-600 cursor-pointer transition-colors">Policy</span>
              <span className="hover:text-gray-600 cursor-pointer transition-colors">Contact</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
