"use client";

import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { canAccess, isLoading } = useProtectedRoute({ requireAdmin: true });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!canAccess) {
    return null;
  }

  return (
    <div className="flex min-h-screen max-w-530 mx-auto">
      <AdminSidebar />

      <main className="flex-1 pt-20 ">
        {children}
      </main>
    </div>
  );
}
