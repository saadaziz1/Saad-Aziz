'use client';

import React from 'react';
import { Heading } from '../atoms/Heading';
import { Button } from '../atoms/Button';
import { NFTCard } from '../molecules/NFTCard';
import { useUserNFTs } from '@/src/hooks/useUserNFTs';
import { useAccount } from 'wagmi';
import { RefreshCcw } from 'lucide-react';

export const NFTGallery = () => {
    const { isConnected } = useAccount();
    const { nfts, isLoading, refresh } = useUserNFTs();

    React.useEffect(() => {
        window.addEventListener('nft-minted', refresh);
        return () => window.removeEventListener('nft-minted', refresh);
    }, [refresh]);

    if (!isConnected) return null;

    return (
        <section id="gallery" className="py-24 bg-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <Heading level={2} className="mb-2">Your <span className="text-red-600">Collection</span></Heading>
                        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">
                            {isLoading ? 'Searching the Abyss...' : `${nfts.length} Slayers Recruited`}
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={refresh}
                        disabled={isLoading}
                        className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800"
                    >
                        <RefreshCcw className={`w-3 h-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <NFTCard key={i} isSkeleton />
                        ))}
                    </div>
                ) : nfts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {nfts.map((nft) => (
                            <NFTCard
                                key={nft.tokenId.toString()}
                                tokenId={nft.tokenId.toString()}
                                name={nft.metadata.name}
                                image={nft.metadata.image}
                                attributes={nft.metadata.attributes}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-32 border-2 border-dashed border-zinc-900 rounded-[32px] flex flex-col items-center justify-center text-center">
                        <p className="text-zinc-600 font-bold uppercase tracking-[0.2em] mb-4">No Slayers Found</p>
                        <p className="text-zinc-800 text-sm max-w-xs">
                            Begin the summoning ritual above to recruit your first Demon Slayer to the corps.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};
