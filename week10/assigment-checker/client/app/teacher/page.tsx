"use client";

import React from "react";
import StatsGrid from "@/components/organisms/StatsGrid";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const DASHBOARD_STATS = [
    { label: "Total Assignments", value: "24", },
    { label: "Students Submissions", value: "1,248", },
    { label: "AI Evaluations Done", value: "1,102", },
    { label: "Avg. Accuracy Score", value: "98.2%", },
];

const RECENT_ASSIGNMENTS = [
    { id: 1, title: "Mental Health Essay", status: "Evaluation In Progress", count: 45, mode: "Strict" },
    { id: 2, title: "Data Structures Report", status: "Completed", count: 120, mode: "Loose" },
    { id: 3, title: "Environmental Ethics", status: "Draft", count: 0, mode: "Strict" },
];

import { useAssignments, useAIInsights, useDashboardStats } from "@/hooks/useAssignments";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import Loader from "@/components/atoms/Loader";

export default function TeacherDashboard() {
    const { assignments, isLoading: loadingAssignments } = useAssignments();
    const { data: insightData, isLoading: loadingInsights, refetch: generateInsight } = useAIInsights();
    const { data: statsData, isLoading: loadingStats } = useDashboardStats();
    const user = useAuthStore((state) => state.user);

    const stats = [
        { label: "Total Assignments", value: statsData?.totalAssignments?.toString() || "0", },
        { label: "Students Submissions", value: statsData?.totalSubmissions?.toString() || "0", },
        { label: "AI Evaluations Done", value: statsData?.aiEvaluations?.toString() || "0", },
        { label: "Avg. Accuracy Score", value: statsData?.avgScore || "0%", },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Teacher Dashboard</h1>
                    <p className="text-foreground/60 font-medium tracking-tight">Welcome back, {user?.name}. Here's an overview of your active evaluations.</p>
                </div>
                <Link href="/teacher/create" className="w-full sm:w-auto">
                    <Button size="lg" className="space-x-2 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Create New</span>
                    </Button>
                </Link>
            </header>

            <StatsGrid stats={stats} />

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Recent Assignments (Organism) */}
                <div className="md:col-span-2 glass rounded-4xl p-8 space-y-6 flex flex-col h-[600px]">
                    <div className="flex justify-between items-center shrink-0">
                        <h2 className="text-2xl font-bold text-white">Recent Assignments</h2>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search assignments..."
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 w-48 transition-all"
                                onChange={(e) => {
                                    const val = e.target.value.toLowerCase();
                                    const items = document.querySelectorAll('.assignment-item');
                                    items.forEach((item: any) => {
                                        const title = item.dataset.title.toLowerCase();
                                        if (title.includes(val)) {
                                            item.style.display = 'flex';
                                        } else {
                                            item.style.display = 'none';
                                        }
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent flex-1">
                        {loadingAssignments ? (
                            <div className="py-20 text-center">
                                <Loader text="Syncing assignments..." />
                            </div>
                        ) : assignments.length === 0 ? (
                            <div className="py-20 text-center space-y-8 glass rounded-3xl border border-dashed border-white/10">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-white font-bold text-xl">No assignments yet</p>
                                    <p className="text-foreground/40 max-w-xs mx-auto text-sm">Create your first assignment to start evaluating student submissions with AI.</p>
                                </div>
                                <Link href="/teacher/create">
                                    <Button variant="primary" size="lg">Create Assignment</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {assignments.map((item: any) => (
                                    <Link href={`/teacher/results?id=${item._id}`} key={item._id} className="block group">
                                        <div className="relative overflow-hidden p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all cursor-pointer flex items-center justify-between">
                                            {/* Hover Glow Effect */}
                                            <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-transparent group-hover:to-transparent transition-all duration-500" />

                                            <div className="flex items-center space-x-6 relative z-10 min-w-0 flex-1">
                                                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center font-black text-xl shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                    {item.title.charAt(0)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate break-all leading-tight mb-1" title={item.title}>
                                                        {item.title}
                                                    </h3>
                                                    <div className="flex items-center space-x-3 text-xs font-bold uppercase tracking-widest text-foreground/30">
                                                        <span className="flex items-center">
                                                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${item.markingMode === 'strict' ? 'bg-danger' : 'bg-success'}`} />
                                                            {item.markingMode}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{item.targetWordCount} Words</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-6 relative z-10 shrink-0">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-1">Deadline</p>
                                                    <p className="text-sm font-bold text-white/80">
                                                        {new Date(item.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-foreground/40 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Insight Box */}
                <div className="glass rounded-4xl p-8 bg-linear-to-br from-primary/10 to-transparent relative overflow-hidden group">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-1000" />
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-xl shadow-primary/40 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight">AI Command Center</h2>
                        </div>
                        <div className="min-h-[120px] flex items-center">
                            {loadingInsights ? (
                                <div className="space-y-3 w-full">
                                    <div className="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
                                    <div className="h-4 bg-white/5 rounded-full w-5/6 animate-pulse"></div>
                                    <div className="h-4 bg-white/5 rounded-full w-2/3 animate-pulse"></div>
                                </div>
                            ) : (
                                <p className="text-foreground/80 leading-relaxed font-medium transition-all duration-500 animate-in fade-in">
                                    {insightData?.insight || "Click 'Generate Insight' to analyze recent submissions and get tips."}
                                </p>
                            )}
                        </div>
                        <div className="pt-4">
                            <Button variant="glass" fullWidth onClick={() => generateInsight()}>
                                {insightData ? "Refresh Insight" : "Generate Insight"}
                            </Button>
                        </div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700"></div>
                </div>
            </div>
        </div>
    );
}
