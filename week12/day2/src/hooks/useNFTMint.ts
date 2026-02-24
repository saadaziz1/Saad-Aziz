'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, KASPLEX_ZKEVM_TESTNET } from '@/src/config/constants';
import { NFT_COLLECTION_ABI } from '@/src/config/abis/NFTCollection';
import toast from 'react-hot-toast';

export function useNFTMint() {
    const [quantity, setQuantity] = useState(1);
    const { address } = useAccount();

    const { data: isWhitelisted } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT_COLLECTION_ABI,
        functionName: 'whitelist',
        args: [address as `0x${string}`],
        query: {
            enabled: !!address,
        }
    });

    const {
        data: hash,
        isPending,
        writeContract
    } = useWriteContract();

    const { isLoading: isConfirming, isSuccess, isError, error: confirmError } = useWaitForTransactionReceipt({
        hash,
    });

    // Handle Toast notifications and side effects
    useEffect(() => {
        if (hash && isPending) {
            toast.loading('Confirming in wallet...', { id: 'mint' });
        }
        if (isConfirming) {
            toast.loading('Slayer summoning in progress...', { id: 'mint' });
        }
        if (isSuccess) {
            toast.success('Successfully recruited new Slayer!', { id: 'mint' });
            window.dispatchEvent(new CustomEvent('nft-minted'));
        }
        if (isError || confirmError) {
            toast.error(confirmError?.message || 'Summoning failed', { id: 'mint' });
        }
    }, [hash, isPending, isConfirming, isSuccess, isError, confirmError]);

    const mint = async (mintPrice: bigint) => {
        if (!address) {
            toast.error('Please connect your wallet first');
            return;
        }

        try {
            writeContract({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: NFT_COLLECTION_ABI,
                functionName: 'mint',
                args: [BigInt(quantity)],
                value: mintPrice * BigInt(quantity),
                chain: KASPLEX_ZKEVM_TESTNET,
            });
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Minting failed');
        }
    };

    const increment = () => setQuantity(prev => Math.min(prev + 1, 3));
    const decrement = () => setQuantity(prev => Math.max(prev - 1, 1));

    return {
        quantity,
        increment,
        decrement,
        mint,
        isWhitelisted: !!isWhitelisted,
        isPending: isPending || isConfirming,
        isSuccess,
        isError: isError || !!confirmError,
        hash,
    };
}
