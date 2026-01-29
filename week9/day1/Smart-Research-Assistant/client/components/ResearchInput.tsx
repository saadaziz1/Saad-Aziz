"use client";

import React, { useState } from "react";
import { Send, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResearchInputProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

export const ResearchInput = ({ onSearch, isLoading }: ResearchInputProps) => {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !isLoading) {
            onSearch(query);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-4xl"
        >
            <div
                className={cn(
                    "group relative overflow-hidden rounded-2xl p-px transition-all duration-500",
                    isLoading ? "bg-linear-to-r from-zinc-500 via-white to-zinc-500 animate-shimmer" : "bg-white/10 hover:bg-white/20"
                )}
            >
                <div className="relative flex items-center rounded-[15px] bg-zinc-950/90 backdrop-blur-xl">
                    <div className="flex pl-6 text-zinc-500">
                        <Cpu size={20} className={cn(isLoading && "animate-pulse")} />
                    </div>
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask your research team..."
                        rows={1}
                        disabled={isLoading}
                        className="w-full bg-transparent px-6 py-6 text-lg font-medium text-white placeholder-zinc-600 outline-none resize-none"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className={cn(
                            "mr-4 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
                            query.trim() && !isLoading
                                ? "bg-white text-black hover:scale-105 active:scale-95"
                                : "bg-white/5 text-zinc-700 cursor-not-allowed"
                        )}
                    >
                        <Send size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </form>
    );
};
