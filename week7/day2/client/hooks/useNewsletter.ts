import { useState } from 'react';
import { useSubscribeToNewsletterMutation } from '@/store/apiSlice';

export const useNewsletter = () => {
    const [subscribe, { isLoading, isSuccess, isError, error }] = useSubscribeToNewsletterMutation();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!email) {
            setMessage({ type: 'error', text: 'Email is required' });
            return;
        }

        try {
            await subscribe({ email }).unwrap();
            setMessage({ type: 'success', text: 'Subscribed successfully! Check your email.' });
            setEmail('');
        } catch (err: any) {
            setMessage({
                type: 'error',
                text: err?.data?.message || 'Failed to subscribe. Please try again.'
            });
        }
    };

    return {
        email,
        setEmail,
        handleSubscribe,
        isLoading,
        message,
    };
};
