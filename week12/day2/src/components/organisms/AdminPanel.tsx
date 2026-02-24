'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useCollectionStats } from '@/src/hooks/useCollectionStats';
import { useNFTAdmin } from '@/src/hooks/useNFTAdmin';
import { Heading } from '../atoms/Heading';
import { Button } from '../atoms/Button';
import { Shield, Unlock, Wallet, Users, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminPanel = () => {
    const { address } = useAccount();
    const { owner, revealed, whitelistActive } = useCollectionStats();
    const { reveal, withdraw, setWhitelistActive, addToWhitelist, loadingStates } = useNFTAdmin();
    const [whitelistInput, setWhitelistInput] = useState('');

    const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();

    const handleActionWithRefresh = (fn: (...args: any[]) => void, ...args: any[]) => {
        fn(...args);
        // Dispatch event after a small delay to allow node to index
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('nft-minted'));
        }, 3000);
    };

    const handleReveal = () => {
        if (!isOwner) {
            toast.error('Only the Grandmaster can invoke the reveal ritual');
            return;
        }
        const baseURI = prompt('Enter Base URI (e.g. ipfs://CID/)', 'ipfs://bafybeihcw6lp7msrcqwhqe6bh5sapqid5u7uemnp4vzp3ys4ye44pd3m5m/');
        if (baseURI) handleActionWithRefresh(reveal, baseURI);
    };

    const handleAddWhitelist = () => {
        if (!isOwner) {
            toast.error('Only the Grandmaster can modify the whitelist');
            return;
        }
        const accounts = whitelistInput.split(',').map(a => a.trim()).filter(a => a.startsWith('0x'));
        if (accounts.length === 0) {
            toast.error('Please enter valid Ethereum addresses');
            return;
        }
        handleActionWithRefresh(addToWhitelist, accounts);
        setWhitelistInput('');
    };

    const handleWithdraw = () => {
        if (!isOwner) {
            toast.error('Only the Grandmaster can withdraw treasury funds');
            return;
        }
        handleActionWithRefresh(withdraw);
    };

    const handleToggleWhitelist = () => {
        if (!isOwner) {
            toast.error('Only the Grandmaster can toggle the gatekeeping');
            return;
        }
        handleActionWithRefresh(setWhitelistActive, !whitelistActive);
    };

    return (
        <section className="py-24 bg-zinc-950 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-xl">
                            <Shield className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <Heading level={2}>Admin <span className="text-red-600">Sanctum</span></Heading>
                            <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Master Controls for the Corps</p>
                        </div>
                    </div>

                    {!isOwner && (
                        <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-zinc-600 animate-pulse" />
                            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest italic">Spectator Mode</span>
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Reveal Control */}
                    <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl space-y-6 flex flex-col">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white font-bold uppercase tracking-wider text-sm">Reveal Ritual</h3>
                            <Unlock className={`w-5 h-5 ${revealed ? 'text-green-500' : 'text-zinc-600'}`} />
                        </div>
                        <p className="text-zinc-500 text-xs leading-relaxed grow">
                            Once invoked, the true forms of all summoned souls will be revealed to the world. This action is irreversible.
                        </p>
                        <Button
                            className="w-full"
                            variant={revealed ? 'secondary' : 'primary'}
                            disabled={revealed || loadingStates.reveal || !isOwner}
                            onClick={handleReveal}
                            isLoading={loadingStates.reveal}
                        >
                            {revealed ? 'Souls Revealed' : 'Invoke Reveal'}
                        </Button>
                    </div>

                    {/* Whitelist Control */}
                    <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white font-bold uppercase tracking-wider text-sm">Gatekeeping</h3>
                            <Users className={`w-5 h-5 ${whitelistActive ? 'text-amber-500' : 'text-zinc-600'}`} />
                        </div>
                        <div className="space-y-4">
                            <Button
                                className="w-full h-10 text-xs"
                                variant="outline"
                                onClick={handleToggleWhitelist}
                                isLoading={loadingStates.whitelist}
                                disabled={loadingStates.whitelist || !isOwner}
                            >
                                <RefreshCcw className="w-3 h-3 mr-2" />
                                {whitelistActive ? 'Deactivate Whitelist' : 'Activate Whitelist'}
                            </Button>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter addresses (0x...)"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-xs text-zinc-300 focus:outline-none focus:border-red-600 transition-colors disabled:opacity-50"
                                    value={whitelistInput}
                                    onChange={(e) => setWhitelistInput(e.target.value)}
                                    disabled={!isOwner}
                                />
                                <Button
                                    size="sm"
                                    className="mt-3 w-full"
                                    onClick={handleAddWhitelist}
                                    isLoading={loadingStates.addWhitelist}
                                    disabled={loadingStates.addWhitelist || !isOwner}
                                >
                                    Add to Whitelist
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Treasury Control */}
                    <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl space-y-6 flex flex-col">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white font-bold uppercase tracking-wider text-sm">Treasury</h3>
                            <Wallet className="w-5 h-5 text-zinc-600" />
                        </div>
                        <p className="text-zinc-500 text-xs leading-relaxed grow">
                            Withdraw all gathered KAS from the summoning rituals into the master treasury.
                        </p>
                        <Button
                            className="w-full"
                            variant="secondary"
                            onClick={handleWithdraw}
                            isLoading={loadingStates.withdraw}
                            disabled={loadingStates.withdraw || !isOwner}
                        >
                            Withdraw Funds
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
