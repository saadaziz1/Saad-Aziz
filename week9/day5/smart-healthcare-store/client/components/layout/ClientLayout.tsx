'use client';

import React from 'react';
import { Chatbot } from '@/components/chat/Chatbot';
import { Toaster } from 'react-hot-toast';
import { ReduxProvider } from '@/store/provider';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ReduxProvider>
            <Toaster position="top-center" />
            {children}
            <Chatbot />
        </ReduxProvider>
    );
}
