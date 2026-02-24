'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heading } from '../atoms/Heading';
import { Button } from '../atoms/Button';
import { Sword } from 'lucide-react';

export const HeroSection = () => {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl blur-[120px] opacity-20 bg-linear-to-br from-red-600 to-transparent rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/30 border border-red-900/30 mb-6">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-red-500">Live on Kasplex Testnet</span>
                    </div>

                    <Heading level={1} className="mb-6 leading-none">
                        Unleash Your <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-white">
                            Slayer Spirit
                        </span>
                    </Heading>

                    <p className="text-zinc-400 text-lg mb-8 max-w-lg leading-relaxed">
                        Join the elite corps of Hashiras. Mint your unique Demon Slayer NFT and claim your place in the eternal struggle between light and shadow.
                    </p>

                    <div className="flex gap-4">
                        <Button size="lg" className="rounded-full shadow-2xl shadow-red-600/20" onClick={() => document.getElementById('mint')?.scrollIntoView({ behavior: 'smooth' })}>
                            <Sword className="w-5 h-5 mr-2" />
                            Mint Now
                        </Button>
                        <Button variant="secondary" size="lg" className="rounded-full" onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}>
                            View Collection
                        </Button>
                    </div>

                    <div className="mt-12 flex items-center gap-12 text-zinc-500">
                        <div>
                            <div className="text-2xl font-black text-white">10</div>
                            <div className="text-[10px] uppercase tracking-widest font-bold">Limited Supply</div>
                        </div>
                        <div className="w-px h-8 bg-zinc-800" />
                        <div>
                            <div className="text-2xl font-black text-white">0.05 KAS</div>
                            <div className="text-[10px] uppercase tracking-widest font-bold">Mint Price</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative"
                >
                    <div className="aspect-square relative z-10 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl shadow-red-900/20">
                        <img
                            src="./demon-slayer-2.jpg" // High quality demon slayer placeholder for hero
                            alt="Demon Slayer"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/30 blur-[80px] -z-10" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-950/50 blur-[80px] -z-10" />
                </motion.div>
            </div>
        </section>
    );
};
