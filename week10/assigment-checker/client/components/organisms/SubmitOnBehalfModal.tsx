"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/atoms/Button";

const behalfSchema = z.object({
    roll: z.string().min(5, "Roll number is required"),
    file: z.any().refine((files) => files?.length > 0, "PDF file is required"),
});

type BehalfFormValues = z.infer<typeof behalfSchema>;

interface SubmitOnBehalfModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: BehalfFormValues) => void;
    isUploading: boolean;
}

const SubmitOnBehalfModal: React.FC<SubmitOnBehalfModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isUploading
}) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<BehalfFormValues>({
        resolver: zodResolver(behalfSchema)
    });

    const watchedFiles = watch("file") as FileList | undefined;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose}></div>
            <div className="glass w-full max-w-md p-10 rounded-4xl relative z-10 shadow-2xl border border-white/10 animate-in slide-in-from-bottom-8 duration-500 text-white">
                <div className="text-center space-y-2 mb-8 uppercase text-white tracking-widest font-black">
                    <h2 className="text-2xl font-black text-white">Submit on Behalf</h2>
                    <p className="text-xs text-foreground/40 font-bold">Manual submission for an individual student.</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest px-1">Roll Number</label>
                        <input
                            type="text"
                            className={`w-full bg-white/5 border ${errors.roll ? "border-danger" : "border-white/10"} rounded-xl px-4 py-4 text-white font-bold focus:outline-none focus:ring-1 focus:ring-primary/50`}
                            placeholder="e.g. 221008"
                            {...register("roll")}
                        />
                        {errors.roll && <p className="text-[10px] font-bold text-danger uppercase px-1">{errors.roll.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest px-1">Upload PDF</label>
                        <div className={`relative w-full h-32 bg-white/5 border-2 border-dashed ${errors.file ? "border-danger/50" : "border-white/10"} rounded-2xl flex flex-col items-center justify-center space-y-2 group hover:border-primary/50 cursor-pointer transition-all`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-foreground/20 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            <span className="text-xs font-bold text-foreground/40 px-4 text-center">
                                {watchedFiles?.[0]?.name || "Select PDF File"}
                            </span>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf" {...register("file")} />
                        </div>
                        {errors.file && <p className="text-[10px] font-bold text-danger uppercase px-1">{errors.file.message as string}</p>}
                    </div>
                    <Button fullWidth size="lg" type="submit" disabled={isUploading}>
                        {isUploading ? "Processing..." : "Grade Submission"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default SubmitOnBehalfModal;
