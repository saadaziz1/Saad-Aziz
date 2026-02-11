"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useSubmission } from "@/hooks/useAssignments";
import ProgressBar from "@/components/atoms/ProgressBar";
import { toast } from "react-hot-toast";

export default function ReviewPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const submissionId = searchParams.get("id");
    const assignmentId = searchParams.get("assignmentId");

    const {
        submission: student,
        isLoading,
        error,
        evaluateSubmission,
        isEvaluating
    } = useSubmission(submissionId || "");

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto py-32 text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-xl shadow-primary/20"></div>
                <p className="text-foreground/30 font-bold uppercase text-[10px] tracking-widest animate-pulse">Initializing Neural Review Engine...</p>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="max-w-7xl mx-auto py-32 text-center space-y-6 animate-in fade-in duration-700">
                <div className="w-16 h-16 bg-danger/10 text-danger rounded-2xl flex items-center justify-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white">Review Portal Offline</h2>
                    <p className="text-foreground/40 font-bold uppercase tracking-widest text-[10px]">The requested submission artifact could not be retrieved.</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/5 transition-all text-sm"
                >
                    Return to Marksheet
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Page Header - Ultra Compact */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass p-4 rounded-3xl border border-white/5 shadow-xl">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className={`absolute inset-0 blur-xl opacity-20 ${student.score >= 80 ? 'bg-accent' : student.score >= 50 ? 'bg-orange-400' : 'bg-danger'}`} />
                            <div className={`w-12 h-12 rounded-xl relative z-10 flex flex-col items-center justify-center border border-white/10 bg-white/5 ${student.score >= 80 ? 'text-accent' : student.score >= 50 ? 'text-orange-400' : 'text-danger'}`}>
                                <span className="text-[6px] font-black uppercase tracking-widest opacity-40 leading-none mb-0.5">Grade</span>
                                <div className="flex items-baseline leading-none">
                                    <span className="text-xl font-black tracking-tighter">{student.remarks === 'Pending Evaluation' ? '-' : student.score}</span>
                                    {student.remarks !== 'Pending Evaluation' && <span className="text-[10px] font-bold opacity-40 ml-0.5">%</span>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-0.5 min-w-0">
                            <h1 className="text-xl font-black text-white tracking-tight truncate max-w-[150px] sm:max-w-xs">{student.studentName}</h1>
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-bold text-foreground/30 px-1.5 py-0.5 bg-white/5 rounded-md border border-white/5 uppercase tracking-widest leading-none">
                                    {student.rollNumber || "N/A"}
                                </span>
                                <span className="text-[9px] font-medium text-white/20 truncate max-w-[100px]">{student.assignmentId?.title || "Metrics"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {(student.remarks === 'Pending Evaluation' || student.remarks === 'Pending' || student.score !== undefined) && (
                        <button
                            onClick={() => {
                                if (assignmentId) {
                                    evaluateSubmission(assignmentId, {
                                        onSuccess: () => toast.success("Refined!"),
                                        onError: (err: any) => toast.error(err.message)
                                    });
                                }
                            }}
                            disabled={isEvaluating}
                            className="group/eval h-10 px-4 bg-primary text-white font-black rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 relative overflow-hidden shadow-lg shadow-primary/20 flex-1 sm:flex-none text-[10px]"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/eval:translate-x-full transition-transform duration-1000" />
                            {isEvaluating ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            )}
                            <span className="relative z-10 uppercase tracking-widest">{isEvaluating ? "..." : "Regenerate"}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Section: Submission Insight (PDF & Content) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Submission Content Insight */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <div className="w-0.5 h-3 bg-primary rounded-full" />
                                <h3 className="text-[8px] font-black text-foreground/40 uppercase tracking-[0.3em]">Evaluation Artifact</h3>
                            </div>
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{student.content?.split(/\s+/).length || 0} Units</span>
                        </div>

                        <div className="glass p-5 rounded-2xl border border-white/5 relative overflow-hidden group/content bg-white/2">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>
                            </div>
                            <div className="relative z-10 font-serif text-sm sm:text-base text-white/70 leading-relaxed selection:bg-primary/40 max-h-[250px] overflow-y-auto custom-scrollbar">
                                <p className="whitespace-pre-wrap">
                                    {student.content}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* PDF Section */}
                    {student.fileUrl && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 px-1">
                                <div className="w-0.5 h-3 bg-accent rounded-full" />
                                <h3 className="text-[8px] font-black text-foreground/40 uppercase tracking-[0.3em]">Source Doc</h3>
                            </div>
                            <div className="w-full h-[450px] glass rounded-2xl border border-white/5 overflow-hidden shadow-lg relative bg-white/2">
                                <iframe
                                    src={student.fileUrl}
                                    className="w-full h-full opacity-90 transition-all hover:opacity-100 duration-700"
                                    title="PDF Artifact"
                                />
                                <div className="absolute bottom-4 right-4 z-20">
                                    <a
                                        href={student.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 backdrop-blur-md bg-black/40 text-white rounded-lg border border-white/5 hover:bg-black/60 transition-all flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                        External
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-5 space-y-6">
                    {/* Feedback */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-5 h-5 rounded-md bg-linear-to-br from-primary to-primary/40 flex items-center justify-center text-white shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                </svg>
                            </div>
                            <h3 className="text-[8px] font-black text-foreground/40 uppercase tracking-[0.4em]">Neural Synthesis</h3>
                        </div>
                        <div className="glass p-5 rounded-2xl border border-white/5 bg-linear-to-br from-white/2 to-transparent">
                            <p className="text-sm text-white/90 font-medium leading-relaxed italic">
                                "{student.remarks}"
                            </p>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-5 h-5 rounded-md bg-linear-to-br from-accent to-accent/40 flex items-center justify-center text-white shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                </svg>
                            </div>
                            <h3 className="text-[8px] font-black text-foreground/40 uppercase tracking-[0.4em]">Data Metrics</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            {student.breakdown && Object.entries(student.breakdown).map(([label, score], idx) => (
                                <div key={label} className="flex flex-col space-y-1.5 p-3 glass rounded-xl border border-white/5 bg-white/2" style={{ animationDelay: `${idx * 50}ms` }}>
                                    <div className="flex justify-between items-center px-0.5">
                                        <span className="text-[7px] font-black text-white/40 uppercase tracking-widest truncate max-w-[120px]">
                                            {label.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <div className={`text-sm font-black tracking-tighter ${score as number >= 80 ? 'text-accent' : score as number >= 50 ? 'text-orange-400' : 'text-danger'}`}>
                                            {score as number}<span className="text-[8px] opacity-40 ml-0.5">%</span>
                                        </div>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 rounded-full ${score as number >= 80 ? 'bg-accent' : score as number >= 50 ? 'bg-orange-400' : 'bg-danger'}`}
                                            style={{ width: `${score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
