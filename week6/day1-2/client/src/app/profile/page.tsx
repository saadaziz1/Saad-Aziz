"use client";

import React, { useEffect } from 'react';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useProfile } from '@/hooks/useProfile';
import { useProfileStore } from '@/store/useProfileStore';
import { ProfileTabs, ProfileForm, OrderHistory, LoyaltyHistory } from '@/components/profile-page';
import { cn } from '@/lib/utils';
import { integralCF } from '@/styles/fonts';
import { useSearchParams } from 'next/navigation';

export default function ProfilePage() {
    const { user, handleLogout } = useAuthSession();
    const { profile, isLoadingProfile } = useProfile();
    const { activeTab, setActiveTab } = useProfileStore();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'orders' && profile?.role === 'USER') {
            setActiveTab('orders');
        }
    }, [searchParams, profile?.role, setActiveTab]);

    if (isLoadingProfile) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-pulse text-gray-400 font-medium">LOADING PROFILE...</div>
            </div>
        );
    }

    return (
        <div className="max-w-frame mx-auto px-4 py-8 md:py-12 bg-white">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 md:mb-12 gap-6">
                <div>
                    <h1 className={cn(integralCF.className, "text-3xl md:text-4xl lg:text-5xl uppercase")}>
                        MY PROFILE
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm md:text-base">
                        Manage your account details and view your order history
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-50 text-red-600 px-6 py-3 rounded-full font-semibold border border-red-100 hover:bg-red-100 transition-all text-sm md:text-base"
                >
                    LOGOUT
                </button>
            </div>

            {/* Profile Stats - Only show for regular users */}
            {profile?.role === 'USER' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-widest mb-2">
                            LOYALTY POINTS
                        </h3>
                        <p className="text-2xl md:text-3xl font-bold text-black">{profile?.loyaltyPoints ?? 0}</p>
                        <p className="text-xs text-gray-400 mt-2 font-medium">Earn points based on purchases</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-widest mb-2">
                            TOTAL ORDERS
                        </h3>
                        <p className="text-2xl md:text-3xl font-bold text-black">{profile?.totalOrders ?? 0}</p>
                        <p className="text-xs text-gray-400 mt-2 font-medium">Orders completed</p>
                    </div>
                    <div className="bg-violet-50 p-6 rounded-2xl border border-violet-100">
                        <h3 className="text-violet-400 text-xs md:text-sm font-bold uppercase tracking-widest mb-2">
                            TOTAL SPENT
                        </h3>
                        <p className="text-2xl md:text-3xl font-bold text-violet-600">
                            ${profile?.totalSpent?.toFixed(2) ?? '0.00'}
                        </p>
                        <p className="text-xs text-violet-400 mt-2 font-medium">Lifetime spending</p>
                    </div>
                </div>
            )}

            {/* Tabs - Only show orders tab for regular users */}
            {profile?.role === 'USER' ? <ProfileTabs /> : (
                <div className="mb-8">
                    <div className="bg-gray-50 p-1 rounded-xl">
                        <div className="bg-white text-black shadow-sm border border-gray-100 px-4 py-3 rounded-lg font-semibold text-center">
                            Profile Details
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Content */}
            <div className="mt-6 md:mt-8">
                {profile?.role === 'USER' ? (
                    <>
                        {activeTab === 'profile' && <ProfileForm />}
                        {activeTab === 'orders' && <OrderHistory />}
                        {activeTab === 'loyalty' && <LoyaltyHistory />}
                    </>
                ) : (
                    <ProfileForm />
                )}
            </div>
        </div>
    );
}