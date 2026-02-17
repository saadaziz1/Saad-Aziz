'use client'

import { useConnection, useConnect, useDisconnect, useEnsName, useConnectors } from 'wagmi';
import { ButtonHTMLAttributes, useEffect, useState } from 'react';
import { Loader2, Wallet, LogOut, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ConnectButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    const { address, isConnected } = useConnection();
    const { mutate: disconnect } = useDisconnect();
    const { mutate: connect, status } = useConnect();
    const { data: ensName } = useEnsName({ address });
    const connectors = useConnectors();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Filter for injected connector (usually MetaMask/browser wallet)
    const connector = connectors.find((c) => c.type === 'injected');

    if (!mounted) {
        return (
            <button
                disabled
                className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                    "bg-white/10 text-white/50 cursor-not-allowed",
                    className
                )}
                {...props}
            >
                <Wallet className="w-4 h-4 opacity-50" />
                Connect Wallet
            </button>
        );
    }

    if (isConnected) {
        return (
            <button
                onClick={() => disconnect()}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                    "bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-red-500/50 hover:text-red-200",
                    "backdrop-blur-md shadow-lg",
                    className
                )}
                {...props}
            >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                <LogOut className="w-4 h-4 ml-2 opacity-50" />
            </button>
        );
    }

    // No wallet detected
    if (!connector) {
        return (
            <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                    "group relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                    "bg-linear-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500",
                    "text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5",
                    className
                )}
            >
                <Wallet className="w-4 h-4" />
                Install MetaMask
                <ExternalLink className="w-3 h-3 opacity-75" />
            </a>
        );
    }

    return (
        <button
            onClick={() => connect({ connector })}
            disabled={status === 'pending'}
            className={cn(
                "group relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                "bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500",
                "text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            {...props}
        >
            {status === 'pending' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Wallet className="w-4 h-4 transition-transform group-hover:scale-110" />
            )}
            {status === 'pending' ? 'Connecting...' : 'Connect Wallet'}
        </button>
    );
}
