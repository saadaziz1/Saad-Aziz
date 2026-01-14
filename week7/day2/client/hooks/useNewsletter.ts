import { useState } from 'react';
import { useSubscribeToNewsletterMutation } from '@/store/apiSlice';
import { toast } from 'react-hot-toast';

export const useNewsletter = () => {
    const [subscribe, { isLoading, isSuccess, isError, error }] = useSubscribeToNewsletterMutation();
    const [email, setEmail] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Email is required');
            return;
        }

        try {
            await subscribe({ email }).unwrap();
            toast.success('Subscribed successfully! Check your email.');
            setEmail('');
        } catch (err: any) {
            const errorMsg = err?.data?.message || 'Failed to subscribe. Please try again.';
            toast.error(errorMsg);
        }
    };

    return {
        email,
        setEmail,
        handleSubscribe,
        isLoading,
    };
};
