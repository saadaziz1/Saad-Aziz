import React from "react";
import Link from "next/link";

interface ResultsTableProps {
    submissions: any[];
    filter: string;
    setFilter: (f: string) => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
    submissions,
    filter,
    setFilter,
}) => {
    return (
        <div className="space-y-6">
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md group">
                    <div className="absolute inset-0 bg-primary/5 blur-xl group-focus-within:bg-primary/10 transition-all rounded-3xl" />
                    <div className="relative glass p-1.5 rounded-2xl border border-white/5 flex items-center">
                        <div className="pl-4 pr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Find student or roll number..."
                            className="w-full bg-transparent border-none py-2.5 text-white placeholder:text-white/20 focus:outline-none text-sm font-medium"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        <div className="px-3">
                            <div className="text-[10px] font-black bg-white/5 px-2 py-1 rounded text-white/30 tracking-tight">ESC</div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3 text-xs">
                        <span className="font-black text-foreground/30 uppercase tracking-[0.2em]">Filter</span>
                        <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
                            <button className="px-3 py-1 bg-primary/20 text-primary font-bold rounded-md">All</button>
                            <button className="px-3 py-1 text-white/40 hover:text-white transition-colors">Graded</button>
                            <button className="px-3 py-1 text-white/40 hover:text-white transition-colors">Pending</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="glass rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl relative group">
                {/* Subtle Gradient background matching the dashboard style */}
                <div className="absolute -left-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/2">
                                <th className="pl-10 pr-6 py-8 text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em]">Student Identity</th>
                                <th className="px-6 py-8 text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] text-center">AI Rating</th>
                                <th className="px-6 py-8 text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em]">Quick Summary</th>
                                <th className="pl-6 pr-10 py-8 text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] text-right">Operational</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/2 text-white bg-white/1">
                            {submissions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-10 py-32 text-center">
                                        <div className="max-w-md mx-auto space-y-6">
                                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-black text-white px-2 leading-tight">No submissions to display</h3>
                                            <p className="text-foreground/40 font-medium text-sm">Waiting for students to submit their work for this assignment.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                submissions.map((result: any, i: number) => (
                                    <tr key={i} className="hover:bg-white/5 transition-all group/row">
                                        <td className="pl-10 pr-6 py-8">
                                            <div className="flex items-center space-x-5 overflow-hidden min-w-0">
                                                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-white/10 to-transparent border border-white/5 flex items-center justify-center font-black text-primary text-xl shadow-inner shrink-0 group-hover/row:scale-110 transition-transform duration-300">
                                                    {result.studentName?.[0] || "?"}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-lg text-white group-hover/row:text-primary transition-colors truncate wrap-break-word leading-tight mb-1" title={result.studentName}>
                                                        {result.studentName}
                                                    </p>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">ID: {result.rollNumber || "N/A"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8 text-center">
                                            {result.remarks === 'Pending Evaluation' ? (
                                                <div className="inline-flex items-center px-4 py-2 bg-white/5 rounded-full border border-white/5 text-[10px] font-black text-foreground/40 uppercase tracking-widest animate-pulse">
                                                    Processing
                                                </div>
                                            ) : (
                                                <div className={`text-3xl font-black tracking-tighter ${result.score >= 80 ? 'text-accent drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]' :
                                                    result.score >= 50 ? 'text-orange-400' : 'text-danger'
                                                    }`}>
                                                    {result.score}<span className="text-xs opacity-40 ml-0.5">%</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-8 max-w-sm">
                                            <div className="relative">
                                                <div className="absolute -left-4 top-0 w-0.5 h-full bg-primary/20 rounded-full scale-y-0 group-hover/row:scale-y-100 transition-transform origin-top" />
                                                <p className="text-sm text-foreground/60 font-medium leading-relaxed italic line-clamp-2 group-hover/row:text-white transition-colors">
                                                    "{result.remarks}"
                                                </p>
                                            </div>
                                        </td>
                                        <td className="pl-6 pr-10 py-8 text-right">
                                            <Link
                                                href={`/teacher/results/review?id=${result._id}&assignmentId=${result.assignmentId}`}
                                                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white/5 hover:bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5 hover:border-primary hover:shadow-lg hover:shadow-primary/20 group/btn"
                                            >
                                                <span>Analyze Report</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ResultsTable;
