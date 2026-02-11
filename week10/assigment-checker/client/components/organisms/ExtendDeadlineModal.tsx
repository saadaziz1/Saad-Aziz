"use client";

import React from "react";
import Button from "@/components/atoms/Button";

interface ExtendDeadlineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    isUpdating: boolean;
    currentDeadline?: string | Date;
    autoEvaluation?: boolean;
}

const ExtendDeadlineModal: React.FC<ExtendDeadlineModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isUpdating,
    currentDeadline,
    autoEvaluation
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose}></div>
            <div className="glass w-full max-w-md p-10 rounded-4xl relative z-10 shadow-2xl border border-white/10 animate-in slide-in-from-bottom-8 duration-500 text-white">
                <div className="text-center space-y-2 mb-8 uppercase tracking-widest font-black">
                    <h2 className="text-2xl font-black text-white">Extend Deadline</h2>
                    <p className="text-xs text-foreground/40 font-bold">Set a new submission cutoff for this assignment.</p>
                </div>
                <form className="space-y-6" onSubmit={onSubmit}>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest px-1">New Deadline Date</label>
                        <input
                            type="datetime-local"
                            name="deadline"
                            required
                            defaultValue={currentDeadline ? new Date(currentDeadline).toISOString().slice(0, 16) : ""}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-bold focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                    </div>

                    <div className="pt-2">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative flex items-center pt-1">
                                <input
                                    type="checkbox"
                                    name="autoEvaluation"
                                    defaultChecked={autoEvaluation}
                                    className="peer h-5 w-5 rounded bg-white/5 border border-white/10 text-primary focus:ring-primary/20 transition-all checked:bg-primary"
                                />
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">Enable AI Auto-Evaluation</span>
                                <p className="text-[10px] text-foreground/40 font-medium leading-tight">AI will evaluate submissions at the deadline.</p>
                            </div>
                        </label>
                    </div>
                    <Button fullWidth size="lg" type="submit" disabled={isUpdating}>
                        {isUpdating ? "Updating..." : "Save New Deadline"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ExtendDeadlineModal;
