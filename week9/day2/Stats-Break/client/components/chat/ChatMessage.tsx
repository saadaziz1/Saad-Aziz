"use client";
import React from "react";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
    role: "user" | "assistant";
    text: string;
}

export default function ChatMessage({ role, text }: ChatMessageProps) {
    const isUser = role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6 min-w-0 w-full`}>
            <div className="max-w-[85%] lg:max-w-2xl min-w-0">
                <div className={`panel-header !text-[8px] sm:!text-[10px] ${isUser ? "self-end !bg-cyan-500 float-right mr-4" : "!bg-pink-600 ml-4"
                    }`}>
                    {isUser ? "USER UPLINK" : "AI NEXUS"}
                </div>
                <div className={`pixel-box clear-both p-4 relative min-w-0 ${isUser ? "border-cyan-400 !bg-panel" : "pixel-box-magenta"
                    }`}>
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                        <div className={`p-1 shrink-0 ${isUser ? "bg-cyan-500 text-black" : "bg-pink-500 text-white"}`}>
                            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <p className={`text-[10px] sm:text-xs font-mono leading-relaxed uppercase break-all ${isUser ? "text-cyan-50" : "text-pink-50"
                            }`}>
                            {text}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
