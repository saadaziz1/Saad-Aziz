"use client";

import { useState } from "react";
import { useStudentSubmissions } from "@/hooks/useAssignments";
import ProgressBar from "@/components/atoms/ProgressBar";
import Button from "@/components/atoms/Button";
import { toast } from "react-hot-toast";

export default function StudentResults() {
    const { data: submissions, isLoading } = useStudentSubmissions();
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

    // Filter submissions: result only shown if deadline has passed
    const visibleSubmissions = submissions?.filter((sub: any) => {
        if (!sub.assignmentId) return false;
        return new Date() > new Date(sub.assignmentId.deadline);
    }) || [];

    const getRubric = (sub: any) => {
        if (sub.breakdown && sub.breakdown.length > 0) {
            return sub.breakdown;
        }
        // Fallback or empty if pending
        return [];
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (selectedSubmission) {
        const rubric = getRubric(selectedSubmission);
        const isPending = selectedSubmission.remarks === 'Pending Evaluation';

        return (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center space-x-4 mb-6">
                    <button
                        onClick={() => setSelectedSubmission(null)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-2xl font-bold text-white">Back to Results</h2>
                </div>

                <div className="glass p-10 rounded-[3rem] relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 text-white">
                        <div className="space-y-2">
                            <p className="text-xs font-black text-primary uppercase tracking-[0.3em]">{selectedSubmission.assignmentId.title}</p>
                            <h2 className="text-4xl font-extrabold text-white">Evaluation Report</h2>
                            <p className="text-lg text-foreground/60 font-medium tracking-tight">
                                Submitted on {new Date(selectedSubmission.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-center bg-white/5 border border-white/10 p-6 rounded-3xl w-full md:w-32">
                            <span className="text-sm font-bold text-foreground/40">SCORE</span>
                            <span className="text-5xl font-black text-white">{isPending ? '-' : selectedSubmission.score}</span>
                            <span className={`text-xs font-bold mt-1 ${isPending ? "text-warning" : selectedSubmission.score >= 50 ? "text-accent" : "text-danger"}`}>
                                {isPending ? "PENDING" : selectedSubmission.score >= 50 ? "PASSED" : "FAILED"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 glass p-10 rounded-[2.5rem] space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">🤖</div>
                            <h3 className="text-xl font-bold text-white">AI Feedback</h3>
                        </div>
                        <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 relative">
                            <p className="text-lg text-white/90 leading-relaxed font-medium italic">
                                "{selectedSubmission.remarks}"
                            </p>
                            {isPending && <p className="text-sm text-foreground/40 mt-2">Detailed AI feedback will be available once the evaluation is complete.</p>}
                        </div>
                    </div>

                    {!isPending && (
                        <div className="glass p-10 rounded-[2.5rem] space-y-8">
                            <h3 className="text-xl font-bold text-white">Breakdown</h3>
                            <div className="space-y-6">
                                {rubric.map((item: any, idx: number) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-foreground/60 mb-1">
                                            <span>{item.criteria}</span>
                                        </div>
                                        <ProgressBar progress={item.score} variant="primary" />
                                    </div>
                                ))}
                                {rubric.length === 0 && <p className="text-foreground/40 text-sm">No details available.</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="space-y-1">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">My Gradebook</h1>
                <p className="text-foreground/60 font-medium tracking-tight">View your graded assignments. Results are available after the deadline.</p>
            </header>

            {!visibleSubmissions || visibleSubmissions.length === 0 ? (
                <div className="py-20 text-center glass rounded-4xl border border-dashed border-white/10">
                    <p className="text-foreground/40 font-bold">No results available yet. (Check back after deadlines!)</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleSubmissions.map((sub: any) => {
                        const isPending = sub.remarks === 'Pending Evaluation';
                        return (
                            <div
                                key={sub._id}
                                onClick={() => setSelectedSubmission(sub)}
                                className="glass p-8 rounded-4xl border border-white/5 hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl">
                                            {sub.assignmentId?.title?.charAt(0) || "A"}
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${isPending ? "bg-warning/10 text-warning" : sub.score >= 50 ? "bg-accent/10 text-accent" : "bg-danger/10 text-danger"}`}>
                                            {isPending ? 'PENDING' : `${sub.score}%`}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{sub.assignmentId?.title || "Unknown Assignment"}</h3>
                                        <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">{new Date(sub.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <p className="text-sm text-foreground/60 line-clamp-2 italic">"{sub.remarks}"</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
