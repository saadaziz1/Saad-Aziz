"use client";
import React from "react";

export default function SystemStatus() {
    return (
        <div className="mt-10">
            <div className="panel-header !bg-cyan-900 ml-4">SYSTEM STATUS</div>
            <div className="pixel-box border-cyan-900/50 !bg-panel p-4 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-cyan-500 p-2 text-black">
                            <span className="font-bold pixel-font text-[10px]">NX</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] pixel-font text-cyan-400 glow-text-cyan">
                                SECURE OVERRIDE ACTIVE
                            </p>
                            <p className="text-[8px] pixel-font text-purple-900">
                                TERMINAL DATA LINK BY NETIXSOL
                            </p>
                        </div>
                    </div>

                    <div className="h-2 flex-1 max-w-xs bg-cyan-950/50 mx-4 border border-cyan-900/30 relative overflow-hidden hidden md:block">
                        <div className="absolute top-0 bottom-0 left-0 bg-cyan-500 w-1/3 animate-[pulse_2s_infinite]"></div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-[8px] pixel-font text-purple-600 uppercase">
                        <span className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-cyan-500 shadow-[0_0_5px_cyan]"></div>
                            LIVE SYNC
                        </span>
                        <span className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-pink-500 animate-ping"></div>
                            NEURAL LINK
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
