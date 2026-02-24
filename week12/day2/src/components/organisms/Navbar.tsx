'use client';

import React from 'react';
import { ConnectButton } from '../molecules/ConnectButton';
import { Heading } from '../atoms/Heading';
import { Flame } from 'lucide-react';

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-zinc-900">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/40">
                        <Flame className="text-white w-6 h-6 fill-current" />
                    </div>
                    <Heading level={3} className="tracking-widest hidden md:block">
                        Demon<span className="text-red-600">Slayer</span>
                    </Heading>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex gap-6 text-xs font-bold uppercase tracking-widest text-zinc-400">
                        <a href="#mint" className="hover:text-red-500 transition-colors">Mint</a>
                        <a href="#gallery" className="hover:text-red-500 transition-colors">Collection</a>
                    </div>
                    <ConnectButton />
                </div>
            </div>
        </nav>
    );
};
