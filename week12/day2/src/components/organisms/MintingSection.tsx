'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heading } from '../atoms/Heading';
import { Button } from '../atoms/Button';
import { MintQuantitySelector } from '../molecules/MintQuantitySelector';
import { useNFTMint } from '@/src/hooks/useNFTMint';
import { useCollectionStats } from '@/src/hooks/useCollectionStats';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
import { IPFS_GATEWAY, METADATA_CID } from '@/src/config/constants';

export const MintingSection = () => {
    const { isConnected } = useAccount();
    const { quantity, increment, decrement, mint, isPending, isWhitelisted } = useNFTMint();
    const { mintPrice, remainingSupply, maxSupply, whitelistActive, revealed } = useCollectionStats();

    const isMintDisabled = remainingSupply === 0 || (whitelistActive && !isWhitelisted);

    return (
        <section id="mint" className="py-24 bg-black relative">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-[32px] p-8 md:p-16 relative overflow-hidden">
                    {/* Animated Background Pulse */}
                    <div className="absolute inset-0 bg-red-600/5 blur-[100px] -z-10 animate-pulse" />

                    <div className="text-center mb-12">
                        <Heading level={2} className="mb-2">Summon Your <span className="text-red-600">Soul</span></Heading>
                        <div className="flex flex-col gap-2 items-center">
                            <p className="text-zinc-500 font-medium uppercase tracking-widest text-[10px]">
                                Current Batch: {maxSupply - remainingSupply} / {maxSupply} Minted
                            </p>
                            {whitelistActive && (
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isWhitelisted ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isWhitelisted ? 'bg-green-500' : 'bg-amber-500'}`} />
                                    {isWhitelisted ? 'Whitelisted' : 'Public Access Restricted'}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Price</span>
                                    <span className="text-white font-black">{formatEther(mintPrice)} KAS</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-zinc-900 pt-4">
                                    <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Total</span>
                                    <span className="text-red-500 font-black text-xl">
                                        {formatEther(mintPrice * BigInt(quantity))} KAS
                                    </span>
                                </div>
                            </div>

                            {!isConnected ? (
                                <div className="text-center p-6 bg-red-950/20 border border-red-900/30 rounded-2xl">
                                    <p className="text-red-400 text-sm font-semibold mb-2">Wallet Disconnected</p>
                                    <p className="text-zinc-500 text-xs">Connect your soul to begin the summoning ritual.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase font-bold text-zinc-500 ml-2">Select Quantity</label>
                                        <MintQuantitySelector
                                            quantity={quantity}
                                            onIncrement={increment}
                                            onDecrement={decrement}
                                            disabled={isPending}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Button
                                            size="lg"
                                            className="w-full text-lg h-16 rounded-2xl uppercase tracking-[0.2em]"
                                            isLoading={isPending}
                                            disabled={isMintDisabled}
                                            onClick={() => mint(mintPrice)}
                                        >
                                            {remainingSupply === 0 ? 'Sold Out' : (whitelistActive && !isWhitelisted ? 'Not Whitelisted' : 'Initiate Mint')}
                                        </Button>

                                        {whitelistActive && !isWhitelisted && (
                                            <p className="text-center text-[10px] text-zinc-500 font-medium">
                                                This stage is for whitelisted souls only.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative group">
                            <div className="aspect-4/5 bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800">
                                <img
                                    src={`${IPFS_GATEWAY}${METADATA_CID}/hidden.jpeg`}
                                    alt="Mystery Summoning"
                                    className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0"
                                />
                            </div>
                            <div className={`absolute -bottom-4 -right-4 font-black px-4 py-2 rounded-lg text-xs tracking-tighter shadow-xl ${revealed ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                {revealed ? 'REVEALED' : 'MYSTERY MINT'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
