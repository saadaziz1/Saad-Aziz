'use client';

import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS, KASPLEX_ZKEVM_TESTNET } from '@/src/config/constants';
import { NFT_COLLECTION_ABI } from '@/src/config/abis/NFTCollection';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

export function useNFTAdmin() {
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();

    const [loadingStates, setLoadingStates] = useState({
        reveal: false,
        withdraw: false,
        whitelist: false,
        addWhitelist: false
    });

    const handleTransaction = async (
        action: keyof typeof loadingStates,
        functionName: string,
        args: any[] = [],
        successMsg: string
    ) => {
        setLoadingStates(prev => ({ ...prev, [action]: true }));
        const tid = toast.loading(`Initiating ${functionName}...`);

        try {
            const hash = await writeContractAsync({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: NFT_COLLECTION_ABI,
                functionName: functionName as any,
                args: args as any,
                chain: KASPLEX_ZKEVM_TESTNET,
            });

            toast.loading(`Confirming ${functionName}...`, { id: tid });

            toast.success(successMsg, { id: tid });
        } catch (error: any) {
            console.error(error);
            toast.error(error.shortMessage || error.message || 'Action failed', { id: tid });
        } finally {
            setLoadingStates(prev => ({ ...prev, [action]: false }));
        }
    };

    const reveal = (baseURI: string) =>
        handleTransaction('reveal', 'reveal', [baseURI], 'Collection successfully revealed!');

    const withdraw = () =>
        handleTransaction('withdraw', 'withdraw', [], 'Funds successfully withdrawn!');

    const setWhitelistActive = (status: boolean) =>
        handleTransaction('whitelist', 'setWhitelistActive', [status], `Whitelist ${status ? 'activated' : 'deactivated'}!`);

    const addToWhitelist = (accounts: string[]) =>
        handleTransaction('addWhitelist', 'addToWhitelist', [accounts], 'Addresses added to whitelist!');

    return {
        reveal,
        withdraw,
        setWhitelistActive,
        addToWhitelist,
        loadingStates,
        isAnyPending: Object.values(loadingStates).some(Boolean)
    };
}
