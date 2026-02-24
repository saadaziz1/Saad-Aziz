'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { ReactNode, useState } from 'react';
import { config } from '@/src/config/wagmi';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider>
                    {children}
                    <Toaster position="bottom-right" />
                </ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
