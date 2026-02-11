import React from "react";
import ProgressBar from "@/components/atoms/ProgressBar";

interface SubmissionModalProps {
    student: any;
    assignmentTitle?: string;
    onClose: () => void;
    onEvaluate?: () => void;
    isEvaluating?: boolean;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({
    student,
    assignmentTitle,
    onClose,
    onEvaluate,
    isEvaluating = false
}) => {
    if (!student) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl animate-in fade-in duration-500" onClick={onClose}></div>

            <div className="glass w-full max-w-7xl h-[90vh] rounded-[3.5rem] relative z-10 flex flex-col shadow-[0_0_150px_-30px_rgba(0,0,0,1)] border border-white/10 animate-in zoom-in-95 duration-500 overflow-hidden">
                {/* Visual Flair: Animated Glows */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

                {/* Modal Header */}
                <div className="px-10 py-8 border-b border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8 bg-white/2 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="relative group">
                            <div className={`absolute inset-0 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity rounded-full ${student.score >= 80 ? 'bg-accent' : student.score >= 50 ? 'bg-orange-400' : 'bg-danger'}`} />
                            <div className={`w-28 h-28 rounded-3xl relative z-10 flex flex-col items-center justify-center border-2 shadow-2xl transition-transform group-hover:scale-105 duration-500 ${student.score >= 80 ? 'bg-accent/10 border-accent/30 text-accent' :
                                student.score >= 50 ? 'bg-orange-400/10 border-orange-400/30 text-orange-400' : 'bg-danger/10 border-danger/30 text-danger'
                                }`}>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">Grade</span>
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-black tracking-tighter">{student.remarks === 'Pending Evaluation' ? '-' : student.score}</span>
                                    {student.remarks !== 'Pending Evaluation' && <span className="text-sm font-bold opacity-60 ml-0.5">%</span>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5 min-w-0">
                            <h2 className="text-4xl font-black text-white tracking-tight truncate">{student.studentName}</h2>
                            <div className="flex items-center space-x-4">
                                <span className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    Roll: {student.rollNumber || "N/A"}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span className="text-xs font-bold text-primary/80 truncate">{assignmentTitle}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {(student.remarks === 'Pending Evaluation' || student.remarks === 'Pending') && onEvaluate && (
                            <button
                                onClick={onEvaluate}
                                disabled={isEvaluating}
                                className="group/eval px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all flex items-center gap-3 disabled:opacity-50 relative overflow-hidden shadow-xl shadow-primary/20"
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/eval:translate-x-full transition-transform duration-1000" />
                                {isEvaluating ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                )}
                                <span className="relative z-10">{isEvaluating ? "Analyzing..." : "Regenerate Analysis"}</span>
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 group/close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white group-hover/close:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative z-10">
                    {/* Left Column: Academic Exhibit */}
                    <div className="space-y-10 group/exhibit">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-6 bg-primary rounded-full" />
                                <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.4em]">Primary Submission</h3>
                            </div>
                            <div className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black text-white/40 border border-white/5 uppercase tracking-widest">
                                Document Analysis: {student.content?.split(/\s+/).length || 0} Lexical Tokens
                            </div>
                        </div>

                        <div className="p-12 bg-linear-to-b from-white/5 to-transparent rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden h-[650px] flex flex-col ring-1 ring-white/5">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>
                            </div>

                            <div className="flex-1 overflow-y-auto font-serif text-xl text-white/90 leading-[1.8] pr-8 scrollbar-thin scrollbar-thumb-white/10 selection:bg-primary/40">
                                <p className="whitespace-pre-wrap first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left drop-shadow-md">
                                    {student.content}
                                </p>
                            </div>

                            {/* Corner Accents */}
                            <div className="absolute bottom-4 right-4 flex space-x-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                            </div>
                        </div>

                        {student.fileUrl && (
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-6 bg-accent rounded-full" />
                                    <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.4em]">Raw Source Artifact</h3>
                                </div>
                                <div className="w-full h-[650px] glass rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl overflow-hidden ring-1 ring-white/10">
                                    <iframe
                                        src={student.fileUrl}
                                        className="w-full h-full grayscale invert opacity-90 contrast-125 transition-all hover:grayscale-0 hover:invert-0 hover:opacity-100 duration-1000"
                                        title="Academic PDF Preview"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: AI Insights Engine */}
                    <div className="space-y-16">
                        {/* Critical Commentary */}
                        <div className="space-y-8 relative">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary to-primary/40 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                </div>
                                <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.4em]">Evaluative Synthesis</h3>
                            </div>

                            <div className="relative group/remarks">
                                <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-accent/20 rounded-[2.5rem] blur-xl opacity-50 group-hover/remarks:opacity-100 transition duration-1000" />
                                <div className="relative p-10 bg-white/5 border border-white/10 rounded-[2.5rem] bg-linear-to-br from-white/5 to-transparent">
                                    <div className="absolute top-0 right-0 p-6 opacity-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017C10.4647 13 10.017 12.5523 10.017 12V9C10.017 7.34315 11.3601 6 13.017 6H19.017C20.6739 6 22.017 7.34315 22.017 9V15C22.017 16.6569 20.6739 18 19.017 18H17.017C16.4647 18 16.017 18.4477 16.017 19V21H14.017ZM2.01697 21L2.01697 18C2.01697 16.8954 2.91241 16 4.01697 16H7.01697C7.56926 16 8.01697 15.5523 8.01697 15V9C8.01697 8.44772 7.56926 8 7.01697 8H3.01697C2.46469 8 2.01697 8.44772 2.01697 9V12C2.01697 12.5523 1.56925 13 1.01697 13H-0.983032C-1.53531 13 -1.98303 12.5523 -1.98303 12V9C-1.98303 7.34315 -0.639893 6 1.01697 6H7.01697C8.67383 6 10.017 7.34315 10.017 9V15C10.017 16.6569 8.67383 18 7.01697 18H5.01697C4.46469 18 4.01697 18.4477 4.01697 19V21H2.01697Z" /></svg>
                                    </div>
                                    <p className="text-2xl text-white font-medium leading-[1.6] italic relative z-10 drop-shadow-sm">
                                        "{student.remarks}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Analytic Metrics */}
                        <div className="space-y-10 group/metrics">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-accent to-accent/40 flex items-center justify-center font-bold text-white shadow-lg shadow-accent/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.4em]">Granular Metrics</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {student.breakdown && Object.entries(student.breakdown).map(([label, score], idx) => (
                                    <div key={label} className="group/item relative animate-in slide-in-from-right-4 duration-500 flex flex-col space-y-4 p-8 glass rounded-[2rem] border border-white/5 hover:border-white/20 transition-all" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Dimension</span>
                                                <span className="text-lg font-bold text-white tracking-tight">
                                                    {label.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-4xl font-black tracking-tighter ${score as number >= 80 ? 'text-accent' :
                                                    score as number >= 50 ? 'text-orange-400' : 'text-danger'
                                                    }`}>
                                                    {score as number}<span className="text-sm opacity-40 ml-0.5">%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                            <div
                                                className={`absolute inset-0 transition-all duration-1000 rounded-full shadow-[0_0_20px_-2px_rgba(255,255,255,0.2)] ${score as number >= 80 ? 'bg-linear-to-r from-accent to-accent/60' : score as number >= 50 ? 'bg-linear-to-r from-orange-400 to-orange-400/60' : 'bg-linear-to-r from-danger to-danger/60'}`}
                                                style={{ width: `${score}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(!student.breakdown || Object.keys(student.breakdown).length === 0) && (
                                    <div className="px-10 py-16 text-center glass rounded-[2.5rem] border border-dashed border-white/10">
                                        <p className="text-foreground/30 font-bold uppercase tracking-widest text-xs">No analytics meta-data available.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionModal;
