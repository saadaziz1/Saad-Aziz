import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetProfileQuery } from '@/store/apiSlice';

export const useAuth = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            // Remove token from URL to keep it clean
            router.replace('/dashboard');
        }
    }, [token, router]);

    const logout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const isAuthenticated = !!(typeof window !== 'undefined' && localStorage.getItem('token'));

    return {
        logout,
        isAuthenticated,
    };
};
