"use client";
import React from "react";

interface CRTLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export default function CRTLayout({ children, className = "" }: CRTLayoutProps) {
    return (
        <div className={`relative min-h-screen bg-main text-main crt-effect ${className}`}>
            <div className="scanline"></div>
            <div className="scanline scanline-delayed"></div>
            <div className="scanline scanline-fast"></div>
            <div className="crt-noise"></div>
            {children}
        </div>
    );
}
