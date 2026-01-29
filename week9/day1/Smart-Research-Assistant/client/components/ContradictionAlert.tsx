"use client";

import React from "react";
import { AlertTriangle, ShieldAlert, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Contradiction {
    type: string;
    message: string;
    conflictingStatements: {
        source: string;
        statement: string;
    }[];
    severity: "low" | "medium" | "high";
}

interface ContradictionAlertProps {
    contradictions: Contradiction[];
}

export const ContradictionAlert = ({ contradictions }: ContradictionAlertProps) => {
    if (!contradictions || contradictions.length === 0) return null;

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 mb-12">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                    <ShieldAlert size={18} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                        Source Divergence Analysis
                    </h3>
                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
                        Detected Conflict in Research Material
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                {contradictions.map((c, i) => (
                    <div
                        key={i}
                        className={cn(
                            "relative overflow-hidden rounded-2xl border border-white/5 bg-white/2 p-6 transition-all duration-300 backdrop-blur-3xl",
                            c.severity === "high" ? "hover:border-red-500/20 shadow-[0_10px_40px_-15px_rgba(239,68,68,0.05)]" : "hover:border-white/10"
                        )}
                    >
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold border",
                                        c.severity === "high" ? "border-red-500/20 text-red-500 bg-red-500/5" : "border-white/10 text-zinc-500 bg-white/5"
                                    )}>
                                        {c.type[0]}
                                    </div>
                                    <h4 className="text-[11px] font-black tracking-widest text-zinc-300 uppercase">
                                        {c.type} Conflict
                                    </h4>
                                </div>
                                <span className={cn(
                                    "text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border border-white/10",
                                    c.severity === "high" ? "text-red-500" : "text-zinc-500"
                                )}>
                                    Impact: {c.severity.toUpperCase()}
                                </span>
                            </div>

                            <p className="text-sm font-bold text-white leading-relaxed">
                                {c.message}
                            </p>

                            <div className="grid gap-3">
                                {c.conflictingStatements.map((s, j) => (
                                    <div key={j} className="relative pl-4 flex flex-col gap-1.5">
                                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-500/20" />
                                        <span className="text-[9px] font-black text-red-500/60 uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-red-500/40" />
                                            {s.source}
                                        </span>
                                        <p className="text-sm leading-relaxed text-zinc-400 font-medium italic">
                                            "{s.statement}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
