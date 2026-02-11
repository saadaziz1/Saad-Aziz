"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/atoms/Button";
import { useAssignments, useStudentSubmissions } from "@/hooks/useAssignments";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

const submissionSchema = z.object({
    file: z.any().refine((files) => files?.length > 0, "PDF file is required"),
});

type SubmissionFormValues = z.infer<typeof submissionSchema>;

export default function StudentDashboard() {
    const { assignments, isLoading: loadingAssignments, uploadSubmissions, isUploading } = useAssignments();
    const { data: mySubmissions, isLoading: loadingSubmissions } = useStudentSubmissions();
    const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
    const [viewingPdfUrl, setViewingPdfUrl] = useState<string | null>(null);
    const user = useAuthStore((state) => state.user);


    const submitForm = useForm<SubmissionFormValues>({
        resolver: zodResolver(submissionSchema),
    });

    const isDeadlinePassed = selectedAssignment
        ? new Date() > new Date(selectedAssignment.deadline)
        : false;

    // Check if current assignment is already submitted
    const existingSubmission = mySubmissions?.find((sub: any) => (sub.assignmentId?._id || sub.assignmentId) === selectedAssignment?._id);

    const onSubmitAssignment = (data: SubmissionFormValues) => {
        if (!selectedAssignment) return;

        const file = data.file[0];

        if (isDeadlinePassed) {
            toast.error("Deadline has passed. Submissions are closed.");
            return;
        }

        // No manual metadata needed for students now, backend handles it from Auth
        uploadSubmissions({
            id: selectedAssignment._id,
            files: [file],
        }, {
            onSuccess: () => {
                toast.success(existingSubmission ? "Re-submission successful!" : "Submission successful!");
                submitForm.reset();
                setSelectedAssignment(null);
            },
            onError: (error: any) => {
                toast.error(error.message || "Upload failed.");
            }
        });
    };

    if (selectedAssignment) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 fade-in duration-500">
                <button
                    onClick={() => setSelectedAssignment(null)}
                    className="flex items-center space-x-2 text-foreground/40 hover:text-white transition-colors font-bold text-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Dashboard</span>
                </button>

                <div className="space-y-6 text-center text-white">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold text-white tracking-tighter">
                            {existingSubmission ? "Update Submission" : "Submit Assignment"}
                        </h1>
                        <p className="text-xl text-foreground/60 font-medium tracking-tight wrap-break-word">{selectedAssignment.title}</p>
                    </div>

                    <div className="max-w-2xl mx-auto glass p-6 rounded-3xl border border-primary/20 bg-primary/5 text-left space-y-3">
                        <div className="flex items-center space-x-2 text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs font-black uppercase tracking-widest">Assignment Instructions</span>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed wrap-break-word">
                            {selectedAssignment.instructions}
                        </p>
                    </div>

                    {existingSubmission && (
                        <div className="inline-block px-4 py-2 rounded-full bg-warning/10 text-warning border border-warning/20 text-xs font-bold uppercase tracking-widest">
                            Existing submission found. Uploading again will replace it.
                        </div>
                    )}
                </div>

                <form onSubmit={submitForm.handleSubmit(onSubmitAssignment)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className={`lg:col-span-2 glass p-12 rounded-4xl border-2 border-dashed ${submitForm.formState.errors.file ? "border-danger/50" : "border-white/10"} hover:border-primary/50 transition-all group flex flex-col items-center justify-center text-center space-y-6 cursor-pointer relative overflow-hidden bg-white/5`}>
                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white">
                                {(submitForm.watch("file") as FileList | undefined)?.[0]?.name || "Click to upload PDF"}
                            </h3>
                            <p className="text-sm text-foreground/40 font-medium">Max 10MB</p>
                            {submitForm.formState.errors.file && (
                                <p className="text-xs font-bold text-danger uppercase tracking-widest">{submitForm.formState.errors.file.message as string}</p>
                            )}
                        </div>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf" {...submitForm.register("file")} />
                    </div>

                    <div className="space-y-6 text-white">
                        <div className="glass p-8 rounded-4xl space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Student Details</label>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1">
                                    <p className="text-sm font-bold text-white">{user?.name}</p>
                                    <p className="text-xs text-foreground/60">{user?.rollNumber}</p>
                                    <p className="text-[10px] text-foreground/40 break-all select-all">{user?.email}</p>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl border ${isDeadlinePassed ? "bg-danger/10 border-danger/20 text-danger" : "bg-primary/10 border-primary/20 text-primary"} space-y-1`}>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span>Deadline</span>
                                    <span>{isDeadlinePassed ? "Closed" : "Open"}</span>
                                </div>
                                <p className="text-xs font-bold">{new Date(selectedAssignment.deadline).toLocaleString()}</p>
                            </div>

                            <Button
                                fullWidth
                                size="lg"
                                type="submit"
                                disabled={isUploading || isDeadlinePassed}
                                variant={isDeadlinePassed ? "glass" : "primary"}
                            >
                                {isUploading ? "Submitting..." : isDeadlinePassed ? "Closed" : existingSubmission ? "Re-Submit" : "Submit"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="space-y-1">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Active Assignments</h1>
                <p className="text-foreground/60 font-medium tracking-tight">Select an assignment to submit your work.</p>
            </header>

            {loadingAssignments ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : assignments.length === 0 ? (
                <div className="py-20 text-center glass rounded-4xl border border-dashed border-white/10">
                    <p className="text-foreground/40 font-bold">No active assignments found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {assignments.map((item: any) => {
                        const submission = mySubmissions?.find((sub: any) => (sub.assignmentId?._id || sub.assignmentId) === item._id);
                        const isSubmitted = !!submission;
                        const deadlinePassed = new Date() > new Date(item.deadline);

                        return (
                            <div
                                key={item._id}
                                className={`glass p-8 rounded-4xl border ${isSubmitted ? 'border-primary/30 bg-primary/5' : 'border-white/5'} hover:border-primary/50 transition-all group flex flex-col justify-between space-y-8 relative overflow-hidden`}
                            >
                                {isSubmitted && (
                                    <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow-lg z-10">
                                        Submitted
                                    </div>
                                )}

                                <div className="space-y-4 cursor-pointer" onClick={() => !deadlinePassed && setSelectedAssignment(item)}>
                                    <div className={`w-14 h-14 rounded-2xl ${isSubmitted ? 'bg-primary text-white' : 'bg-primary/10 text-primary'} flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform`}>
                                        {item.title.charAt(0)}
                                    </div>
                                    <div className="space-y-1 min-w-0 overflow-hidden">
                                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2 break-all" title={item.title}>{item.title}</h3>
                                        <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">{item.markingMode} Mode</p>
                                    </div>
                                </div>

                                {isSubmitted && (
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center space-x-2 overflow-hidden">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="text-xs text-foreground/80 truncate max-w-[100px]">Current PDF</span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setViewingPdfUrl(submission.fileUrl);
                                            }}
                                            className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wide"
                                        >
                                            View
                                        </button>
                                    </div>
                                )}

                                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Deadline</span>
                                        <span className={`text-xs font-bold ${deadlinePassed ? 'text-danger' : 'text-white/60'}`}>
                                            {new Date(item.deadline).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <Button
                                        variant={isSubmitted ? "glass" : "primary"}
                                        size="sm"
                                        onClick={() => setSelectedAssignment(item)}
                                        disabled={deadlinePassed}
                                        className={isSubmitted ? "" : "group-hover:bg-primary group-hover:text-white group-hover:border-primary"}
                                    >
                                        {deadlinePassed ? "Closed" : isSubmitted ? "Re-Submit" : "Submit"}
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
            }
            {viewingPdfUrl && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setViewingPdfUrl(null)}></div>
                    <div className="glass w-full max-w-5xl h-[85vh] rounded-[2rem] relative z-10 flex flex-col border border-white/10 shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 rounded-t-4xl">
                            <h3 className="text-lg font-black text-white uppercase tracking-widest">Submission Preview</h3>
                            <button
                                onClick={() => setViewingPdfUrl(null)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 bg-white/5 p-1 rounded-b-4xl overflow-hidden relative">
                            <iframe
                                src={viewingPdfUrl}
                                className="w-full h-full rounded-b-[1.8rem]"
                                title="Submission PDF"
                            />
                            <div className="absolute bottom-6 right-6 z-20">
                                <a
                                    href={viewingPdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-black/80 backdrop-blur-md text-white font-bold rounded-2xl border border-white/10 hover:bg-black hover:border-primary/50 transition-all flex items-center gap-2 shadow-2xl"
                                >
                                    <span>Open External</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
