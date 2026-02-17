'use client'

import { Task } from '@/hooks/useTodo';
import { useTodo } from '@/hooks/useTodo';
import { GlassCard } from '@/components/ui/GlassCard';
import { CheckCircle2, Circle, Trash2, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface TaskItemProps {
    task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
    const { toggleTask, deleteTask, isWritePending } = useTodo();

    const handleToggle = () => {
        if (isWritePending) return;
        toggleTask(task.id);
    };

    const handleDelete = () => {
        if (isWritePending) return;
        deleteTask(task.id);
    };

    return (
        <GlassCard className={cn(
            "group relative flex flex-col gap-4 p-5 transition-all duration-300",
            task.completed ? "opacity-75 bg-green-900/10 border-green-500/20" : "hover:-translate-y-1"
        )}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                    <button
                        onClick={handleToggle}
                        disabled={isWritePending}
                        className={cn(
                            "mt-1 shrink-0 transition-colors duration-200",
                            task.completed ? "text-green-500 hover:text-green-400" : "text-gray-400 hover:text-indigo-400"
                        )}
                    >
                        {task.completed ? (
                            <CheckCircle2 className="w-6 h-6" />
                        ) : (
                            <Circle className="w-6 h-6" />
                        )}
                    </button>

                    <div className="space-y-1 min-w-0 flex-1 overflow-hidden">
                        <h3 className={cn(
                            "text-lg font-semibold transition-all duration-300 break-all",
                            task.completed ? "line-through text-gray-400" : "text-white"
                        )}>
                            {task.title}
                        </h3>
                        {task.description && (
                            <p className={cn(
                                "text-sm transition-colors duration-300 break-all whitespace-pre-wrap",
                                task.completed ? "text-gray-500" : "text-gray-300"
                            )}>
                                {task.description}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleDelete}
                    disabled={isWritePending}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                    aria-label="Delete task"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 pl-10 border-t border-white/5 pt-3">
                <CalendarDays className="w-3 h-3" />
                <span>
                    Created {formatDistanceToNow(Number(task.timestamp) * 1000, { addSuffix: true })}
                </span>
            </div>

            {/* Visual Indicator Line */}
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-colors duration-300",
                task.completed ? "bg-green-500" : "bg-indigo-500"
            )} />
        </GlassCard>
    );
}
