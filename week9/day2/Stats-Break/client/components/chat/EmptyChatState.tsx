"use client";
import React from "react";
import { BarChart3 } from "lucide-react";

export default function EmptyChatState() {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center space-y-12 w-full max-w-md px-4">
                <div className="inline-block relative">
                    <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 animate-pulse"></div>
                    <div className="pixel-box border-cyan-400 !bg-panel p-8 relative">
                        <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400 animate-bounce" />
                        <div className="absolute -top-4 -left-4 panel-header !bg-pink-600">
                            STATUS OK
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-sm sm:text-lg pixel-font text-cyan-400 glow-text-cyan">
                        CONNECTING TO WORLD DATABASE...
                    </h3>
                    <div className="text-[8px] sm:text-[10px] pixel-font text-purple-400 space-y-2 text-left bg-black/40 p-4 sm:p-6 border-l-4 border-pink-500">
                        <p>{">"} INITIALIZING NEURAL UPLINK...</p>
                        <p>{">"} SCANNING DATA NODES...</p>
                        <p>{">"} AWAITING USER COMMAND...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
