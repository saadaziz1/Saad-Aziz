"use client";

import React from "react";

interface AssignmentGridProps {
    assignments: any[];
    searchParams: any;
    loading: boolean;
}

const AssignmentGrid: React.FC<AssignmentGridProps> = ({ assignments, searchParams, loading }) => {
    if (loading) {
        return (
            <div className="max-w-screen-2xl mx-auto py-20 text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-foreground/40 font-bold tracking-widest uppercase text-xs">Loading Assignments...</p>
            </div>
        );
    }

    return (
        <div className="max-w-screen-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="space-y-1">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Reports & Results</h1>
                <p className="text-foreground/60 font-medium tracking-tight">Select an assignment below to view detailed student evaluations and marks sheets.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {assignments?.map((item: any) => (
                    <div
                        key={item._id}
                        onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set("id", item._id);
                            window.history.pushState(null, "", `?${params.toString()}`);
                            window.location.reload();
                        }}
                        className="glass p-8 rounded-4xl border border-white/5 hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between space-y-8 min-w-0"
                    >
                        <div className="space-y-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform shrink-0">
                                {item.title.charAt(0)}
                            </div>
                            <div className="space-y-1 min-w-0 overflow-hidden">
                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2 break-all" title={item.title}>{item.title}</h3>
                                <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">{item.markingMode} Mode</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Deadline</span>
                                <span className="text-xs font-bold text-white/60">{new Date(item.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="p-2 bg-white/5 rounded-xl text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {assignments?.length === 0 && !loading && (
                <div className="py-20 text-center glass rounded-4xl border border-dashed border-white/10">
                    <p className="text-foreground/40 font-bold">No assignments found. Go to the dashboard to create one.</p>
                </div>
            )}
        </div>
    );
};

export default AssignmentGrid;
