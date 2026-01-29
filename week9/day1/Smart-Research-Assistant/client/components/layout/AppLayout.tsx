"use client";

import React, { useRef } from "react";
import { Sidebar } from "@/components/Sidebar";

interface AppLayoutProps {
    children: React.ReactNode;
    onUploadClick?: () => void;
    isUploading?: boolean;
}

export const AppLayout = ({ children, onUploadClick, isUploading = false }: AppLayoutProps) => {
    // We can allow the sidebar to trigger an upload if a handler is provided
    return (
        <div className="flex min-h-screen bg-[#030303] text-zinc-100 selection:bg-white selection:text-black">
            <Sidebar onUploadClick={onUploadClick} isUploading={isUploading} />

            <main className="flex flex-1 flex-col items-center px-6 py-12 lg:ml-72 lg:px-20">
                <div className="flex w-full max-w-4xl flex-col gap-12">
                    {children}
                </div>
            </main>
        </div>
    );
};
