"use client";

import React, { useState } from "react";

interface DashboardTemplateProps {
    sidebar: React.ReactElement; // Note: Changed to element to allow cloning if needed, but passing state directly is better
    children: React.ReactNode;
}

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({ sidebar, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background relative overflow-hidden">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed top-6 left-6 z-30 p-2 glass rounded-xl text-white"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Wrapper */}
            <div className={`
        fixed lg:sticky top-0 left-0 h-screen z-50 transition-transform duration-300 transform
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
                {React.cloneElement(sidebar as React.ReactElement<any>, { onClose: () => setIsOpen(false) })}
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full min-w-0 p-6 md:p-8 lg:p-12 overflow-y-auto relative">
                {/* Spacer for mobile menu button fixed placement if page doesn't have enough top padding */}
                <div className="h-12 lg:hidden" />
                {children}
            </main>
        </div>
    );
};

export default DashboardTemplate;
