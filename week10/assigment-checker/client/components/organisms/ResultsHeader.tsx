import React from "react";
import Button from "@/components/atoms/Button";
import { useRouter } from "next/navigation";

interface ResultsHeaderProps {
    assignmentTitle?: string;
    instructions?: string;
    onSubmitOnBehalf: () => void;
    onExtendDeadline: () => void;
    onExport: () => void;
    onEvaluateAll: () => void;
    isEvaluating: boolean;
    autoEvaluation?: boolean;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({
    assignmentTitle,
    instructions,
    onSubmitOnBehalf,
    onExtendDeadline,
    onExport,
    onEvaluateAll,
    isEvaluating,
    autoEvaluation
}) => {
    const router = useRouter();

    return (
        <header className="w-full space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            {/* Row 1: Navigation & Identity & Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="w-14 h-14 rounded-full glass flex items-center justify-center text-white hover:bg-primary hover:scale-110 transition-all shrink-0 shadow-xl shadow-black/20 group/back"
                        title="Return to Dashboard"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tighter leading-none">Marks Sheet</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-2 ml-1">Analytical Assessment Engine</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        variant="glass"
                        onClick={onSubmitOnBehalf}
                        className="space-x-3 border-primary/20 text-primary py-4 px-6 rounded-2xl hover:bg-primary/5 transition-all group/btn"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">Submit on Behalf</span>
                    </Button>
                    <Button
                        variant="glass"
                        onClick={onExtendDeadline}
                        className="space-x-3 border-accent/20 text-accent py-4 px-6 rounded-2xl hover:bg-accent/5 transition-all group/btn"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">Extend Deadline</span>
                    </Button>
                    <div className="relative group/eval">
                        <Button
                            variant="glass"
                            onClick={onEvaluateAll}
                            disabled={isEvaluating}
                            className="space-x-3 border-secondary/20 text-secondary py-4 px-6 rounded-2xl hover:bg-secondary/5 transition-all relative overflow-hidden"
                        >
                            {isEvaluating ? (
                                <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover/eval:translate-x-1 group-hover/eval:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            )}
                            <span className="text-[10px] font-black uppercase tracking-widest relative z-10">{isEvaluating ? "Processing..." : "Evaluate All"}</span>
                        </Button>
                        <div className="absolute top-full right-0 mt-1 pointer-events-none">
                            <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border backdrop-blur-md opacity-0 group-hover/eval:opacity-100 transition-opacity ${autoEvaluation ? 'text-primary border-primary/20 bg-primary/5' : 'text-foreground/30 border-white/5 bg-white/5'}`}>
                                {autoEvaluation ? "🤖 Auto-Trigger Active" : "📂 Manual Mode"}
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="glass"
                        onClick={onExport}
                        className="space-x-3 py-4 px-6 rounded-2xl border-white/10 text-white/60 hover:text-white transition-all group/btn"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">Export CSV</span>
                    </Button>
                </div>
            </div>

            {/* Row 2: Assignment Identity & Protocol Display */}
            <div className="relative group/protocol animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
                <div className="absolute -inset-1 bg-linear-to-r from-primary/10 via-primary/5 to-transparent rounded-[3rem] blur-xl opacity-0 group-hover/protocol:opacity-100 transition duration-1000" />
                <div className="relative glass p-10 lg:p-14 rounded-[3rem] border border-white/5 bg-linear-to-br from-white/5 to-transparent flex flex-col lg:flex-row gap-12 items-start">
                    <div className="space-y-3 lg:w-1/3 shrink-0 min-w-0">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-7 bg-primary rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] shrink-0" />
                            <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.4em] truncate">Current Context</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight wrap-break-word line-clamp-3" title={assignmentTitle}>
                            {assignmentTitle || "Global Assessment"}
                        </h2>
                    </div>

                    <div className="lg:flex-1 space-y-4 lg:pl-12 lg:border-l border-white/5 min-w-0 w-full">
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/20 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] truncate">Evaluation Protocol</span>
                        </div>
                        <p className="text-lg lg:text-xl text-white/50 leading-relaxed font-medium italic selection:bg-primary/40 break-words line-clamp-6">
                            {instructions || "The standard evaluation matrix is being applied for this assessment session. Verify all candidate artifacts against the established rubric dimensions."}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ResultsHeader;
