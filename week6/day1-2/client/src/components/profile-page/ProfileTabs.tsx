"use client";

import React from 'react';
import { useProfileStore } from '@/store/useProfileStore';

export const ProfileTabs = () => {
    const { activeTab, setActiveTab } = useProfileStore();

    const tabs = [
        { id: 'profile' as const, label: 'Profile Details' },
        { id: 'orders' as const, label: 'Order History' },
        { id: 'loyalty' as const, label: 'Loyalty Points' },
    ];

    return (
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 bg-gray-50 p-1 rounded-xl mb-8">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${activeTab === tab.id
                        ? 'bg-white text-black shadow-sm border border-gray-100'
                        : 'text-gray-600 hover:text-black hover:bg-white/50'
                        }`}
                >

                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
            ))}
        </div>
    );
};