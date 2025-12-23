"use client";

import { useMovies } from "@/hooks/useMovies";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuthStore } from "@/lib/authStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Video, Plus, CreditCard } from "lucide-react";
import Link from "next/link";
import { Movie } from "@/types";

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const { movies } = useMovies();
  const { analytics, isAnalyticsLoading } = useAnalytics();

  // Calculate real-time video stats from movies data
  const videoStats = {
    totalVideos: Array.isArray(movies) ? movies.length : 0,
    topGenre: Array.isArray(movies) && movies.length > 0 
      ? movies.reduce((acc: Record<string, number>, movie: Movie) => {
          acc[movie.genre] = (acc[movie.genre] || 0) + 1;
          return acc;
        }, {})
      : {},
    recentUploads: 0
  };

  const topGenreName = Object.keys(videoStats.topGenre).length > 0 
    ? Object.entries(videoStats.topGenre).sort(([,a], [,b]) => (b as number) - (a as number))[0][0]
    : 'N/A';

  // Debug auth state
  console.log('Admin Dashboard - Auth state:', { user });

  if (!user) {
    return null;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-white text-2xl sm:text-3xl 3xl:text-6xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 3xl:text-xl">Welcome back, {user?.name}</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card className="bg-[#0A0A0A] border-[#1A1A1A] p-6 3xl:p-16">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm 3xl:text-lg font-medium">Total Videos</p>
                <p className="text-white text-2xl 3xl:text-4xl font-bold mt-1">
                  {videoStats.totalVideos}
                </p>
              </div>
              <div className="w-12 h-12 3xl:w-16 3xl:h-16 bg-white/10 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 3xl:w-8 3xl:h-8 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#1A1A1A] p-6 3xl:p-16">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm 3xl:text-lg font-medium">Total Users</p>
                <p className="text-white text-2xl 3xl:text-4xl font-bold mt-1">
                  {isAnalyticsLoading ? '...' : analytics?.totalUsers || 0}
                </p>
              </div>
              <div className="w-12 h-12 3xl:w-16 3xl:h-16 bg-white/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 3xl:w-8 3xl:h-8 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#1A1A1A] p-6 3xl:p-16 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm 3xl:text-lg font-medium">Active Subscriptions</p>
                <p className="text-white text-2xl 3xl:text-4xl font-bold mt-1">
                  {isAnalyticsLoading ? '...' : analytics?.totalSubscriptions || 0}
                </p>
              </div>
              <div className="w-12 h-12 3xl:w-16 3xl:h-16 bg-white/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 3xl:w-8 3xl:h-8 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Detail Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users Detail */}
          <Card className="bg-[#0A0A0A] border-[#1A1A1A] p-6 3xl:p-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-lg 3xl:text-2xl font-semibold">Users Overview</h2>
              <Link href="/admin/users">
                <Button className="bg-white text-black hover:bg-gray-200 text-sm 3xl:text-base 3xl:px-6 3xl:py-3 h-8 3xl:h-auto">
                  Manage Users
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[#1A1A1A]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-300 text-sm">Super Admins</span>
                </div>
                <span className="text-white font-medium">
                  {isAnalyticsLoading ? '...' : analytics?.usersByRole?.find((r: any) => r._id === 'SUPER_ADMIN')?.count || 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[#1A1A1A]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-gray-300 text-sm">Regular Users</span>
                </div>
                <span className="text-white font-medium">
                  {isAnalyticsLoading ? '...' : analytics?.usersByRole?.find((r: any) => r._id === 'USER')?.count || 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-gray-300 text-sm">Subscribed Users</span>
                </div>
                <span className="text-white font-medium">
                  {isAnalyticsLoading ? '...' : analytics?.totalSubscriptions || 0}
                </span>
              </div>
            </div>
          </Card>

          {/* Videos Detail */}
          <Card className="bg-[#0A0A0A] border-[#1A1A1A] p-6 3xl:p-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-lg 3xl:text-2xl font-semibold">Videos Overview</h2>
              <Link href="/admin/videos">
                <Button className="bg-white text-black hover:bg-gray-200 text-sm 3xl:text-base 3xl:px-6 3xl:py-3 h-8 3xl:h-auto">
                  Manage Videos
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[#1A1A1A]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-300 text-sm">Total Videos</span>
                </div>
                <span className="text-white font-medium">
                  {videoStats.totalVideos}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[#1A1A1A]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <Video className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-gray-300 text-sm">Top Genre</span>
                </div>
                <span className="text-white font-medium">
                  {topGenreName}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-gray-300 text-sm">Recent Uploads (7 days)</span>
                </div>
                <span className="text-white font-medium">
                  0
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;