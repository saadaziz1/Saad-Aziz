"use client";
import React, { useState, useEffect } from "react";
import { MessageCircle, Clock } from "lucide-react";

interface ConversationItemProps {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    onClick: () => void;
}

function SafeDate({ iso }: { iso: string }) {
    const [date, setDate] = useState("");
    useEffect(() => {
        if (iso) setDate(new Date(iso).toLocaleDateString());
    }, [iso]);
    return <>{date}</>;
}

export default function ConversationItem({
    title,
    createdAt,
    updatedAt,
    isActive,
    onClick,
}: ConversationItemProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-4 border-2 transition-all relative group ${isActive
                ? "bg-cyan-500/10 border-cyan-500 shadow-[0_0_10px_rgba(45,226,230,0.2)]"
                : "bg-black/20 border-cyan-900/50 hover:border-cyan-700"
                }`}
        >
            {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 animate-pulse"></div>
            )}
            <div className="flex items-start gap-3">
                <MessageCircle className={`w-3 h-3 mt-1 ${isActive ? 'text-cyan-400' : 'text-purple-600'}`} />
                <div className="flex-1 min-w-0">
                    <p className={`font-bold text-[10px] pixel-font truncate ${isActive ? 'text-white' : 'text-cyan-900 group-hover:text-cyan-400'}`}>
                        {title.toUpperCase()}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[8px] pixel-font text-purple-700">
                        <Clock className="w-2 h-2" />
                        <SafeDate iso={createdAt || updatedAt} />
                    </div>
                </div>
            </div>
        </button>
    );
}
