import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useConnection } from 'wagmi';
import { TODO_ABI, TODO_CONTRACT_ADDRESS } from '@/config/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

export interface Task {
    id: bigint;
    title: string;
    description: string;
    completed: boolean;
    timestamp: bigint;
    exists: boolean;
}

export function useTodo() {
    const { address } = useConnection();
    const queryClient = useQueryClient();
    const { mutate: writeContract, data: hash, error: writeError, isPending: isWritePending } = useWriteContract();

    const { data: tasks, isLoading: isTasksLoading, refetch: refetchTasks } = useReadContract({
        address: TODO_CONTRACT_ADDRESS,
        abi: TODO_ABI,
        functionName: 'getAllTasks',
        account: address,
        query: {
            enabled: !!address,
        },
    });

    const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isConfirmError } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isConfirmed) {
            refetchTasks();
            toast.success('Transaction confirmed!', { description: 'Your task has been updated on the blockchain.' });
        }
    }, [isConfirmed, refetchTasks]);

    useEffect(() => {
        if (isConfirmError) {
            toast.error('Transaction failed', { description: 'The transaction was rejected or failed.' });
        }
    }, [isConfirmError]);

    useEffect(() => {
        if (writeError) {
            toast.error('Transaction error', {
                description: writeError.message || 'Failed to submit transaction'
            });
        }
    }, [writeError]);

    const createTask = (title: string, description: string) => {
        writeContract({
            address: TODO_CONTRACT_ADDRESS,
            abi: TODO_ABI,
            functionName: 'createTask',
            args: [title, description],
        });
    };

    const toggleTask = (id: bigint) => {
        writeContract({
            address: TODO_CONTRACT_ADDRESS,
            abi: TODO_ABI,
            functionName: 'toggleTask',
            args: [id],
        });
    };

    const deleteTask = (id: bigint) => {
        writeContract({
            address: TODO_CONTRACT_ADDRESS,
            abi: TODO_ABI,
            functionName: 'deleteTask',
            args: [id],
        });
    };

    return {
        tasks: tasks as Task[] | undefined,
        isTasksLoading,
        createTask,
        toggleTask,
        deleteTask,
        isWritePending,
        isConfirming,
        isConfirmed,
        hash,
        writeError
    };
}
