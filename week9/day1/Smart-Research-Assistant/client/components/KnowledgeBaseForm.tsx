"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FileText, Type, Upload, Send, Loader2, Sparkles, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

const schema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long (max 100)'),
    topic: z.string().min(3, 'Topic must be at least 3 characters').max(50, 'Topic is too long (max 50)'),
    content: z.string().max(10000, 'Content exceeds 10,000 character limit').optional(),
    file: z.any().optional(),
}).refine((data) => {
    if (!data.content && (!data.file || data.file.length === 0)) {
        return false;
    }
    return true;
}, {
    message: "Either content or a file must be provided",
    path: ["content"],
});

type FormData = z.infer<typeof schema>;

export const KnowledgeBaseForm = () => {
    const [mode, setMode] = useState<'type' | 'upload'>('type');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            topic: '',
            content: '',
        }
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            if (mode === 'upload') {
                const formData = new FormData();
                formData.append('file', data.file[0]);
                formData.append('filename', data.title);
                formData.append('topic', data.topic);

                await axios.post(`${API_URL}/documents/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await axios.post(`${API_URL}/documents/manual`, {
                    title: data.title,
                    topic: data.topic,
                    content: data.content,
                });
            }
            toast.success('Document saved successfully!');
            reset();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to save document');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto rounded-2xl border border-white/5 bg-white/2 p-8 backdrop-blur-2xl">
            <div className="relative space-y-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Database size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Knowledge Synchronization</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">
                        Ingest <span className="text-zinc-500">Material.</span>
                    </h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-1">Identifier</label>
                            <div className="group relative rounded-xl p-px bg-white/10 hover:bg-white/20 transition-all">
                                <input
                                    {...register('title')}
                                    placeholder="Document Title..."
                                    className="w-full bg-zinc-950/90 rounded-[11px] p-4 text-sm font-medium text-white focus:outline-none transition-all placeholder:text-zinc-700"
                                />
                            </div>
                            {errors.title && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight mt-1">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-1">Topic Classification</label>
                            <div className="group relative rounded-xl p-px bg-white/10 hover:bg-white/20 transition-all">
                                <input
                                    {...register('topic')}
                                    placeholder="e.g. Quantum Computing"
                                    className="w-full bg-zinc-950/90 rounded-[11px] p-4 text-sm font-medium text-white focus:outline-none transition-all placeholder:text-zinc-700"
                                />
                            </div>
                            {errors.topic && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight mt-1">{errors.topic.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-1">Input Sequence</label>
                        <div className="flex p-1 bg-zinc-950 rounded-xl border border-white/5 w-fit">
                            <button
                                type="button"
                                onClick={() => setMode('type')}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-bold transition-all",
                                    mode === 'type' ? 'bg-white text-black' : 'text-zinc-600 hover:text-zinc-400'
                                )}
                            >
                                <Type className="w-3.5 h-3.5" /> MANUAL
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode('upload')}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-bold transition-all",
                                    mode === 'upload' ? 'bg-white text-black' : 'text-zinc-600 hover:text-zinc-400'
                                )}
                            >
                                <Upload className="w-3.5 h-3.5" /> PDF LOAD
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {mode === 'type' ? (
                            <motion.div
                                key="type"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-2"
                            >
                                <div className="group relative rounded-2xl p-px bg-white/10 hover:bg-white/20 transition-all">
                                    <textarea
                                        {...register('content')}
                                        rows={8}
                                        placeholder="Enter manual research data for synthesis..."
                                        className="w-full bg-zinc-950/90 rounded-[15px] p-6 text-sm font-medium text-white focus:outline-none transition-all resize-none placeholder:text-zinc-700"
                                    />
                                </div>
                                {errors.content && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight mt-1">{errors.content.message}</p>}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-2"
                            >
                                <div className="relative group/upload border border-dashed border-white/10 rounded-2xl p-16 flex flex-col items-center justify-center gap-6 hover:border-white/30 hover:bg-white/2 transition-all">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        {...register('file')}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center group-hover/upload:scale-105 transition-all duration-300">
                                        <Upload className="w-8 h-8 text-zinc-500 group-hover/upload:text-white" />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <p className="text-xs font-bold text-white group-hover/upload:text-zinc-300">ATTACH PDF</p>
                                        <p className="text-[10px] font-medium text-zinc-600">MAX SIZE: 5024KB</p>
                                    </div>
                                    {watch('file') && watch('file')[0] && (
                                        <div className="mt-2 text-[10px] font-bold text-white bg-white/10 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                                            <FileText className="w-3.5 h-3.5" /> {watch('file')[0].name}
                                        </div>
                                    )}
                                </div>
                                {errors.file && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight mt-1">{errors.file.message as string}</p>}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "w-full h-14 rounded-xl text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-300 flex items-center justify-center gap-3 group",
                            loading
                                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                : "bg-white text-black hover:scale-[1.02] active:scale-[0.98]"
                        )}
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Submit
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
