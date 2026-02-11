"use client";
import { useState, useMemo } from "react";
import Button from "@/components/atoms/Button";
import ProgressBar from "@/components/atoms/ProgressBar";
import Badge from "@/components/atoms/Badge";

import { useAssignments, useAssignmentDetails } from "@/hooks/useAssignments";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function BatchUpload() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const assignmentId = searchParams.get("id");
    const { assignments, uploadSubmissions, isUploading } = useAssignments();
    const { assignment, isLoading: loadingDetails } = useAssignmentDetails(assignmentId as string);
    const [progress, setProgress] = useState(0);
    const [files, setFiles] = useState<File[]>([]);

    const filenameRegex = /^[a-zA-Z0-9.-]+_[a-zA-Z0-9]+\.pdf$/;

    const validationResults = useMemo(() => {
        return files.map(file => ({
            name: file.name,
            isValid: filenameRegex.test(file.name),
            size: (file.size / 1024).toFixed(0) + ' KB'
        }));
    }, [files]);

    const validFiles = useMemo(() => {
        return files.filter(f => filenameRegex.test(f.name));
    }, [files]);

    const handleUpload = () => {
        if (validFiles.length === 0 || !assignmentId) {
            toast.error("No valid files to upload");
            return;
        }

        const invalidCount = files.length - validFiles.length;
        if (invalidCount > 0) {
            if (!confirm(`${invalidCount} files have invalid names and will be skipped. Continue?`)) return;
        }

        uploadSubmissions(
            { id: assignmentId, files: validFiles },
            {
                onSuccess: (data: any) => {
                    const successCount = data.success?.length || 0;
                    const errorCount = data.errors?.length || 0;

                    if (errorCount > 0) {
                        toast(`Processed ${successCount} files. ${errorCount} errors.`);
                    } else {
                        toast.success(`Successfully processed ${successCount} files.`);
                    }

                    router.push(`/teacher/results?id=${assignmentId}`);
                },
                onError: (error: any) => {
                    toast.error(error.message || "Upload failed");
                }
            }
        );
    };

    if (!assignmentId) {
        return (
            <div className="max-w-screen-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header className="space-y-1">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Batch Evaluation</h1>
                    <p className="text-foreground/60 font-medium tracking-tight">Select an assignment to start uploading student submissions for AI grading.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {assignments?.map((item: any) => (
                        <div
                            key={item._id}
                            onClick={() => {
                                const params = new URLSearchParams(searchParams);
                                params.set("id", item._id);
                                router.push(`?${params.toString()}`);
                            }}
                            className="glass p-8 rounded-4xl border border-white/5 hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between space-y-8"
                        >
                            <div className="space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="space-y-1 min-w-0 overflow-hidden">
                                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2 break-all" title={item.title}>{item.title}</h3>
                                    <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">{item.markingMode} Mode</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className="text-xs font-bold text-white/40">Select Assignment</span>
                                <div className="p-2 bg-white/5 rounded-xl text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                    {assignments?.length === 0 && (
                        <div className="col-span-full py-20 text-center glass rounded-4xl border border-dashed border-white/10">
                            <p className="text-foreground/40 font-bold leading-relaxed"> No assignments found.<br />Please create an assignment first.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="space-y-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.delete("id");
                            router.push(`?${params.toString()}`);
                        }}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-foreground/40 hover:text-white transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div className="min-w-0 overflow-hidden flex-1">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight break-all leading-tight">
                            {loadingDetails ? "Loading Assignment..." : (assignment?.title || "Batch Evaluation")}
                        </h1>
                        <p className="text-foreground/60 font-medium">
                            {loadingDetails ? "Fetching details..." : "Upload student PDFs for collective AI evaluation"}
                        </p>
                    </div>
                </div>

                {assignment && (
                    <div className="glass p-6 rounded-3xl border border-primary/20 bg-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1 flex-1 min-w-0">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Target Context</span>
                            <p className="text-sm text-white/80 leading-relaxed max-w-full break-all line-clamp-3">{assignment.instructions}</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-center px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                                <span className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest">Deadline</span>
                                <span className={`text-xs font-bold ${new Date() > new Date(assignment.deadline) ? 'text-danger' : 'text-white'}`}>
                                    {new Date(assignment.deadline).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="text-center px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                                <span className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest">Focus Areas</span>
                                <span className="text-xs font-bold text-white">{assignment.focusAreas?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Upload Zone */}
                    <div className="glass p-8 md:p-12 rounded-4xl border-2 border-dashed border-white/5 hover:border-primary/50 transition-all group flex flex-col items-center justify-center text-center space-y-6 cursor-pointer relative overflow-hidden">
                        <input
                            type="file"
                            multiple
                            accept=".pdf"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            onChange={(e) => {
                                if (e.target.files) {
                                    const newFiles = Array.from(e.target.files);
                                    setFiles(prev => [...prev, ...newFiles]);
                                }
                            }}
                        />
                        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-white">Select Submissions</h2>
                            <p className="text-sm text-foreground/40 font-medium">Drop folders or multiple PDF files here</p>
                        </div>
                    </div>

                    {/* Validation Table */}
                    {files.length > 0 && (
                        <div className="glass rounded-4xl overflow-hidden border border-white/5">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    Files to Process
                                    <Badge variant="neutral">{files.length}</Badge>
                                </h3>
                                <button onClick={() => setFiles([])} className="text-xs text-red-400 font-bold hover:underline uppercase tracking-wider">Clear All</button>
                            </div>
                            <div className="overflow-x-auto max-h-[400px]">
                                <table className="w-full text-left border-collapse">
                                    <thead className="text-xs font-black text-foreground/40 uppercase tracking-widest bg-white/2">
                                        <tr>
                                            <th className="px-6 py-4">Filename</th>
                                            <th className="px-6 py-4 text-center">Format</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {validationResults.map((result, i) => (
                                            <tr key={i} className="group hover:bg-white/2 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className={`text-sm font-bold ${result.isValid ? 'text-white/80' : 'text-danger'}`}>{result.name}</span>
                                                        <span className="text-[10px] text-foreground/30 font-bold uppercase">{result.size}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {result.isValid ? (
                                                        <Badge variant="primary">Valid</Badge>
                                                    ) : (
                                                        <Badge variant="danger">Invalid Name</Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                                                        className="p-2 rounded-lg hover:bg-danger/20 text-foreground/20 hover:text-danger transition-all"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-6 bg-white/2 border-t border-white/5">
                                <Button
                                    fullWidth
                                    size="lg"
                                    onClick={handleUpload}
                                    disabled={isUploading || validFiles.length === 0}
                                >
                                    {isUploading ? "AI is processing..." : `Evaluate ${validFiles.length} Valid Submissions`}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="space-y-6">
                    <div className="glass p-8 rounded-4xl space-y-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-xs">i</span>
                            Naming Convention
                        </h3>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                            <p className="text-xs text-foreground/60 font-medium leading-relaxed">
                                The system uses the filename to automatically link results to students. Files MUST follow this format:
                            </p>
                            <code className="block p-3 rounded-xl bg-black/40 text-primary font-mono text-xs break-all">
                                firstName-lastName_rollNumber.pdf
                            </code>
                            <div className="space-y-2 pt-2 text-[11px] font-bold uppercase tracking-wider text-foreground/30">
                                <p className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary"></span> Correct: <span className="text-foreground/60">john-doe_CS101.pdf</span></p>
                                <p className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-danger"></span> Incorrect: <span className="text-foreground/60">john_doe.pdf</span></p>
                            </div>
                        </div>
                    </div>

                    {isUploading && (
                        <div className="glass p-8 rounded-4xl space-y-6 border-primary/30 animate-pulse">
                            <h3 className="font-bold text-white tracking-widest text-xs uppercase opacity-40">AI Evaluation in progress</h3>
                            <ProgressBar progress={progress} variant="primary" />
                            <p className="text-xs text-foreground/60 font-medium italic">
                                Evaluating content quality, structure, and adherence to instructions...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
