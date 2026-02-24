'use client';

import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS } from '@/src/config/constants';
import { NFT_COLLECTION_ABI } from '@/src/config/abis/NFTCollection';

export function useCollectionStats() {
    const { data: mintPrice } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT_COLLECTION_ABI,
        functionName: 'mintPrice',
    });

    const { data: totalMinted } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT_COLLECTION_ABI,
        functionName: 'totalMinted',
    });

    const { data: maxSupply } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT_COLLECTION_ABI,
        functionName: 'MAX_SUPPLY',
    });

    const { data: remainingSupply } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT_COLLECTION_ABI,
        functionName: 'remainingSupply',
    });

    const { data: revealed } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT_COLLECTION_ABI,
        functionName: 'revealed',
    });

    const { data: whitelistActive } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT_COLLECTION_ABI,
        functionName: 'whitelistActive',
    });

    const { data: owner } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT_COLLECTION_ABI,
        functionName: 'owner',
    });

    return {
        mintPrice: (mintPrice as bigint) || 0n,
        totalMinted: Number(totalMinted || 0),
        maxSupply: Number(maxSupply || 0),
        remainingSupply: Number(remainingSupply || 0),
        revealed: !!revealed,
        whitelistActive: !!whitelistActive,
        owner: owner as `0x${string}`,
    };
}
