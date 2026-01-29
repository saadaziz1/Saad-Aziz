"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
    id: string;
    name: string;
    status: "pending" | "running" | "completed";
    data?: any;
}

interface WorkflowTraceProps {

    steps: Step[];
    contradictions?: any[];
}

export const WorkflowTrace = ({ steps, contradictions = [] }: WorkflowTraceProps) => {
    return (
        <div className="w-full flex flex-col gap-6 rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-2xl overflow-hidden">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-zinc-400">
                    <div className="p-2 rounded-lg bg-white/5">
                        <Clock size={16} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                        Neural Research Pipeline
                    </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Stream Active</span>
                </div>
            </div>

            <div className="relative flex flex-col md:flex-row justify-between pt-4 pb-2 gap-8 md:gap-0">
                {/* Global Background Lines */}
                {/* Desktop: Horizontal Line */}
                <div className="hidden md:block absolute left-0 top-[34px] w-full h-px bg-white/5" />

                {/* Mobile: Vertical Line connecting centers of icons */}
                {/* Assuming icon is 20px+padding, center is around ~26px from left? 
                    Icon wrapper is h-9 w-9 (36px). Center is 18px.
                    Wrapper has 'border'. Let's strictly align. 
                    If icon wrapper is w-9 (36px, see below), center is 1.125rem (18px) + parent padding?
                    No, flex-1 container.
                    Let's position the line relative to the left edge of the Icon column.
                */}
                <div className="md:hidden absolute left-[1.125rem] top-4 w-px h-[calc(100%-2rem)] bg-white/5" />

                {steps.map((step, index) => {
                    const isCompleted = step.status === "completed";
                    const isRunning = step.status === "running";
                    const isPending = step.status === "pending";

                    // Determine if this step has specific issues (like contradictions)
                    const hasIssues = step.id === "checker" && contradictions.length > 0;

                    // Get step-specific metrics
                    let metaInfo = "";
                    if (isCompleted && step.data) {
                        if (step.id === "splitter" && step.data.subQueries) metaInfo = `${step.data.subQueries.length} sub-queries`;
                        if (step.id === "finder") metaInfo = `${step.data.count || 0} docs found`;
                        if (step.id === "ranker") metaInfo = `Top score: ${(step.data.topScore || 0).toFixed(2)}`;
                        if (step.id === "summarizer") metaInfo = `${step.data.count || 0} summarized`;
                        if (step.id === "checker") metaInfo = hasIssues ? `${contradictions.length} conflicts` : "Clean";
                        if (step.id === "answerer") metaInfo = `${step.data.length || 0} chars`;
                    }

                    return (
                        <div key={step.id} className="relative flex flex-row md:flex-col items-center md:items-center gap-4 md:flex-1">

                            {/* Connector Line Fills logic:
                                If previous step is completed, fill the line FROM previous TO current.
                                However, visually we usually fill "up to current".
                                Since we map, we can fill the line "behind" this node if index > 0.
                            */}
                            {index > 0 && steps[index - 1].status === "completed" && (
                                <>
                                    {/* Desktop Fill (Horizontal from left) */}
                                    <div className={cn(
                                        "hidden md:block absolute -left-1/2 top-[18px] w-full h-px -z-10 transition-colors duration-500",
                                        hasIssues && index === steps.length - 2 ? "bg-red-500" : "bg-emerald-500"
                                    )} />

                                    {/* Mobile Fill (Vertical from top) */}
                                    {/* Needs to reach from previous icon bottom to current icon top? 
                                        Actually, simpler to act as a long line overlapping the grey background.
                                        Position: top: -something. height: something.
                                        Since gap is 2rem (gap-8), and icon height is 2.25rem (w-9 h-9).
                                        Distance center to center is roughly gap + height.
                                        Let's try absolute positioning reaching UP.
                                    */}
                                    <div className={cn(
                                        "md:hidden absolute left-[1.125rem] -top-8 h-8 w-px -z-10 transition-colors duration-500",
                                        hasIssues && index === steps.length - 2 ? "bg-red-500" : "bg-emerald-500"
                                    )} />
                                </>
                            )}

                            {/* Icon Wrapper */}
                            <div className={cn(
                                "relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 border border-white/10 bg-zinc-900",
                                isCompleted ?
                                    (hasIssues ? "border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]" :
                                        "bg-zinc-900 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]") :
                                    isRunning ? "border-emerald-500/50 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]" :
                                        "text-zinc-600"
                            )}>
                                {isCompleted ? (
                                    hasIssues ? <AlertTriangle size={14} fill="currentColor" className="text-red-500" /> : <CheckCircle2 size={16} />
                                ) : isRunning ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                                )}
                            </div>

                            {/* Text Content */}
                            <div className="flex flex-col items-start md:items-center text-left md:text-center gap-0.5">
                                <span
                                    className={cn(
                                        "text-[10px] font-bold tracking-widest uppercase transition-all duration-300",
                                        hasIssues ? "text-red-400" : isPending ? "text-zinc-700" : "text-white"
                                    )}
                                >
                                    {step.name}
                                </span>
                                <AnimatePresence>
                                    {isCompleted && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={cn(
                                                "text-[9px] font-black",
                                                hasIssues ? "text-red-500" : "text-zinc-500"
                                            )}
                                        >
                                            {metaInfo || "completed"}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
