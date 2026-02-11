import { useState, useEffect } from 'react';
import { userService, User } from '../lib/services/userService';
import { toast } from 'react-hot-toast';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingIds, setProcessingIds] = useState<string[]>([]);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const data = await userService.getUsers();
            setUsers(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch users');
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleBlock = async (id: string) => {
        if (processingIds.includes(id)) return;

        try {
            setProcessingIds(prev => [...prev, id]);
            const updatedUser = await userService.toggleBlock(id);
            setUsers(users.map(u => u._id === id ? updatedUser : u));
            toast.success(updatedUser.isBlocked ? 'User blocked' : 'User unblocked');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Action failed');
        } finally {
            setProcessingIds(prev => prev.filter(pid => pid !== id));
        }
    };

    const changeRole = async (id: string, role: string) => {
        if (processingIds.includes(id)) return;

        try {
            setProcessingIds(prev => [...prev, id]);
            const updatedUser = await userService.changeRole(id, role);
            setUsers(users.map(u => u._id === id ? updatedUser : u));
            toast.success(`Role changed to ${role}`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Action failed');
        } finally {
            setProcessingIds(prev => prev.filter(pid => pid !== id));
        }
    };

    return {
        users,
        isLoading,
        error,
        processingIds,
        refresh: fetchUsers,
        toggleBlock,
        changeRole
    };
};
