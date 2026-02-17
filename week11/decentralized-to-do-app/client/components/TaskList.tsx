'use client'

import { useTodo } from '@/hooks/useTodo';
import { TaskItem } from '@/components/TaskItem';
import { GlassCard } from '@/components/ui/GlassCard';
import { Archive, ClipboardList, CheckCircle2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function TaskList() {
    const { tasks, isTasksLoading } = useTodo();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const activeTasks = tasks?.filter((task) => !task.completed).sort((a, b) => Number(b.timestamp) - Number(a.timestamp)) || [];
    const completedTasks = tasks?.filter((task) => task.completed).sort((a, b) => Number(b.timestamp) - Number(a.timestamp)) || [];

    // Show loading state until mounted
    if (!mounted || isTasksLoading) {
        return (
            <GlassCard className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
                <Loader2 className="w-16 h-16 mb-4 text-indigo-400 animate-spin" />
                <p className="text-lg font-medium">Loading blockchain data...</p>
            </GlassCard>
        );
    }

    if (!tasks?.length) {
        return (
            <GlassCard className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
                <Archive className="w-16 h-16 mb-4 text-indigo-400 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">No active tasks</h3>
                <p>Your list is clear. Add a new task to get started!</p>
            </GlassCard>
        );
    }

    return (
        <div className="space-y-8">
            {/* Active Tasks Section */}
            {activeTasks.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <ClipboardList className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-200 to-indigo-400">
                            Active Tasks ({activeTasks.length})
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {activeTasks.map((task) => (
                            <TaskItem key={task.id.toString()} task={task} />
                        ))}
                    </div>
                </section>
            )}

            {/* Completed Tasks Section */}
            {completedTasks.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-4 mt-8 opacity-75">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-green-200 to-green-400">
                            Completed ({completedTasks.length})
                        </h2>
                    </div>
                    <div className="space-y-4 opacity-75">
                        {completedTasks.map((task) => (
                            <TaskItem key={task.id.toString()} task={task} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
