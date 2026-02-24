import React from 'react';
import { Heading } from '../atoms/Heading';
import { Button } from '../atoms/Button';
import { IPFS_GATEWAY, CONTRACT_ADDRESS, KASPLEX_ZKEVM_TESTNET } from '@/src/config/constants';
import { ExternalLink } from 'lucide-react';

import { Skeleton } from '../atoms/Skeleton';

interface NFTCardProps {
    name?: string;
    image?: string;
    tokenId?: string | number;
    attributes?: { trait_type: string; value: string }[];
    isSkeleton?: boolean;
}

export const NFTCard: React.FC<NFTCardProps> = ({ name, image, tokenId, attributes, isSkeleton }) => {
    if (isSkeleton) {
        return (
            <div className="flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden h-full">
                <Skeleton className="aspect-square rounded-none shrink-0" />
                <div className="p-5 flex flex-col grow">
                    <div className="flex justify-between items-start mb-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-5 w-10" />
                    </div>
                    <div className="space-y-3 mt-4 mb-6">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-4/5" />
                        <Skeleton className="h-3 w-2/3" />
                    </div>
                    <Skeleton className="mt-auto h-10 w-full rounded-lg" />
                </div>
            </div>
        );
    }

    // Metadata stores image as ipfs://CID/#.jpeg
    // We need to convert it to a gateway URL
    const imageUrl = image?.startsWith('ipfs://')
        ? image.replace('ipfs://', IPFS_GATEWAY)
        : image || '';

    const explorerUrl = tokenId ? `${KASPLEX_ZKEVM_TESTNET.blockExplorers?.default.url}/token/${CONTRACT_ADDRESS}/instance/${tokenId}` : '#';

    return (
        <div className="group relative flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-red-600/50 transition-all duration-300 h-full">
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

            <div className="aspect-square overflow-hidden bg-zinc-800 relative shrink-0">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="p-5 flex flex-col grow relative z-20">
                <div className="flex justify-between items-start mb-2">
                    <Heading level={4} className="text-zinc-100">{name}</Heading>
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                        #{tokenId?.toString()}
                    </span>
                </div>

                {attributes && attributes.length > 0 ? (
                    <div className="space-y-2 mt-4 mb-6">
                        {attributes.map((attr, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                                <span className="text-zinc-500 uppercase tracking-wider">{attr.trait_type}</span>
                                <span className="text-red-400 font-semibold">{attr.value}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grow min-h-[40px]" />
                )}

                <div className="mt-auto pt-4">
                    <Button
                        size="sm"
                        className="w-full text-[10px] h-10 uppercase tracking-widest bg-red-600 text-white border-transparent hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-900/20"
                        onClick={() => window.open(explorerUrl, '_blank')}
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on Explorer
                    </Button>
                </div>
            </div>
        </div>
    );
};
