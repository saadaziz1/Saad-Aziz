"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { FileText, Download } from "lucide-react";

interface FinalAnswerProps {
    content: string;
    onDownload?: () => void;
}

export const FinalAnswer = ({ content, onDownload }: FinalAnswerProps) => {
    return (
        <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-white">
                            Research Synthesis
                        </h2>
                        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                            Verified Analysis
                        </p>
                    </div>
                </div>

                <button
                    onClick={onDownload}
                    className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white/10 active:scale-95"
                >
                    <Download size={14} />
                    Export MD
                </button>
            </div>

            <div className="prose prose-invert prose-zinc max-w-none">
                <ReactMarkdown
                    components={{
                        h1: ({ className, ...props }) => (
                            <h1 className={cn("text-3xl font-black tracking-tighter text-white mb-8", className)} {...props} />
                        ),
                        h2: ({ className, ...props }) => (
                            <h2 className={cn("text-xl font-bold tracking-tight text-white mt-12 mb-6 border-l-2 border-white/20 pl-4", className)} {...props} />
                        ),
                        p: ({ className, ...props }) => (
                            <p className={cn("text-zinc-400 leading-relaxed mb-6 text-lg", className)} {...props} />
                        ),
                        li: ({ className, ...props }) => (
                            <li className={cn("text-zinc-400 mb-2", className)} {...props} />
                        ),
                        strong: ({ className, ...props }) => (
                            <strong className={cn("text-white font-bold", className)} {...props} />
                        ),
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
};
