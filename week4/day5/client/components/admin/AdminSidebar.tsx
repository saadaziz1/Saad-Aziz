"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Video, Menu, X } from "lucide-react";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/videos", icon: Video, label: "Videos" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-24 left-4 z-50 bg-[#0A0A0A]"
        size="sm"
      >
        <Menu className="w-4 h-4" />
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile sidebar (overlay) */}
      <div
        className={`
          lg:hidden fixed top-0 left-0 h-full w-64 3xl:w-80
          bg-[#0A0A0A] border-r border-[#1A1A1A]
          z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 3xl:p-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-xl 3xl:text-3xl font-bold">Admin Panel</h2>
            <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4 text-white" />
            </Button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    onClick={() => setIsOpen(false)}
                    className={`w-full justify-start 3xl:text-lg 3xl:py-3 ${
                      isActive
                        ? "bg-white text-black"
                        : "bg-transparent text-gray-400 hover:bg-[#1A1A1A] hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar (NORMAL FLOW, NO FIXED) */}
      <aside className="hidden lg:block pt-20 w-64 3xl:w-100 bg-[#0A0A0A] border-r border-[#1A1A1A]">
        <div className="p-6 3xl:p-12">
          <h2 className="text-white text-xl 3xl:text-3xl font-bold mb-8">Admin Panel</h2>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    className={`w-full justify-start 3xl:text-2xl 3xl:py-6 ${
                      isActive
                        ? "bg-white text-black"
                        : "bg-transparent text-gray-400 hover:bg-[#1A1A1A] hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 3xl:w-10 3xl:h-10 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
