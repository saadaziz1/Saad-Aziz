'use client';

import { useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS } from '@/src/config/constants';
import { NFT_COLLECTION_ABI } from '@/src/config/abis/NFTCollection';
import { useEffect, useState } from 'react';

export interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    attributes: { trait_type: string; value: string }[];
}

export function useUserNFTs() {
    const { address } = useAccount();
    const [nfts, setNfts] = useState<{ tokenId: bigint; metadata: NFTMetadata }[]>([]);
    const [loader, setLoader] = useState(false);
    const [refreshNonce, setRefreshNonce] = useState(0);

    const { data: tokenIds, refetch: refetchIds } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT_COLLECTION_ABI,
        functionName: 'tokensOfOwner',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    });

    const { data: revealed, refetch: refetchRevealed } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT_COLLECTION_ABI,
        functionName: 'revealed',
    });

    const refresh = () => {
        setRefreshNonce(prev => prev + 1);
        refetchIds();
        refetchRevealed();
    };

    useEffect(() => {
        async function fetchMetadata() {
            if (!tokenIds) return;
            setLoader(true);
            try {
                const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

                const results = await Promise.all(
                    (tokenIds as bigint[]).map(async (id) => {
                        // In a real dApp, we would call tokenURI(id) for each token.
                        // For efficiency here and since we know the mapping:
                        let url = revealed
                            ? `/metadata/${id}.json`
                            : `/metadata/hidden.json`;

                        // If IPFS is configured, we use the gateway
                        if (process.env.NEXT_PUBLIC_METADATA_FOLDER_CID) {
                            const cid = process.env.NEXT_PUBLIC_METADATA_FOLDER_CID;
                            url = revealed
                                ? `${gateway}${cid}/${id}.json`
                                : `${gateway}${cid}/hidden.json`;
                        }

                        const response = await fetch(url);
                        if (!response.ok) throw new Error(`Failed to fetch metadata for token ${id}`);
                        const metadata = await response.json();
                        return { tokenId: id, metadata };
                    })
                );
                setNfts(results);
            } catch (error) {
                console.error('Failed to fetch metadata:', error);
            } finally {
                setLoader(false);
            }
        }

        fetchMetadata();
    }, [tokenIds, revealed, refreshNonce]);

    return { nfts, isLoading: loader, refresh };
}
