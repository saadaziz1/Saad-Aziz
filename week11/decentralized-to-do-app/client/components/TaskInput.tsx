'use client'

import { useState } from 'react';
import { useTodo } from '@/hooks/useTodo';
import { GlassCard } from '@/components/ui/GlassCard';
import { Loader2, Plus, PenLine, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { validateTaskInput, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from '@/lib/validation';
import { cn } from '@/lib/utils';
import { useConnection } from 'wagmi';

export function TaskInput() {
    const { isConnected } = useConnection();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const { createTask, isWritePending, isConfirming } = useTodo();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Frontend validation
        const validation = validateTaskInput(title, description);
        if (!validation.valid) {
            toast.error(validation.error);
            return;
        }

        try {
            createTask(title, description);
            setTitle('');
            setDescription('');
        } catch (err: any) {
            console.error('Transaction error:', err);
            toast.error('Transaction failed', {
                description: err?.message || 'Failed to create task'
            });
        }
    };

    const isLoading = isWritePending || isConfirming;
    const titleLength = title.length;
    const descriptionLength = description.length;

    const titleNearLimit = titleLength > MAX_TITLE_LENGTH * 0.8;
    const descriptionNearLimit = descriptionLength > MAX_DESCRIPTION_LENGTH * 0.8;

    return (
        <GlassCard className="mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <PenLine className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-200 to-indigo-400">
                        Add New Task
                    </h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm text-gray-400">Title *</label>
                            <span className={cn(
                                "text-xs transition-colors",
                                titleNearLimit ? "text-yellow-500 font-medium" : "text-gray-500"
                            )}>
                                {titleLength} / {MAX_TITLE_LENGTH}
                            </span>
                        </div>
                        <input
                            type="text"
                            placeholder={isConnected ? "What needs to be done?" : "Connect wallet to add tasks"}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isLoading || !isConnected}
                            maxLength={MAX_TITLE_LENGTH}
                            className={cn(
                                "w-full bg-white/5 border rounded-lg px-4 py-3 outline-none transition-all placeholder:text-gray-500",
                                !isConnected && "cursor-not-allowed opacity-60",
                                titleNearLimit
                                    ? "border-yellow-500/50 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50"
                                    : "border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                            )}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm text-gray-400">Description (optional)</label>
                            <span className={cn(
                                "text-xs transition-colors",
                                descriptionNearLimit ? "text-yellow-500 font-medium" : "text-gray-500"
                            )}>
                                {descriptionLength} / {MAX_DESCRIPTION_LENGTH}
                            </span>
                        </div>
                        <textarea
                            placeholder={isConnected ? "Add details..." : "Connect wallet first"}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isLoading || !isConnected}
                            rows={3}
                            maxLength={MAX_DESCRIPTION_LENGTH}
                            className={cn(
                                "w-full bg-white/5 border rounded-lg px-4 py-3 outline-none transition-all placeholder:text-gray-500 resize-none",
                                !isConnected && "cursor-not-allowed opacity-60",
                                descriptionNearLimit
                                    ? "border-yellow-500/50 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50"
                                    : "border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                            )}
                        />
                    </div>
                </div>

                {!isConnected && (
                    <div className="flex items-center gap-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 text-sm">
                        <Wallet className="w-4 h-4 shrink-0" />
                        <span>Please connect your wallet to add tasks</span>
                    </div>
                )}

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={!title.trim() || isLoading || !isConnected}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                Add Task
                            </>
                        )}
                    </button>
                </div>
            </form>
        </GlassCard>
    );
}
