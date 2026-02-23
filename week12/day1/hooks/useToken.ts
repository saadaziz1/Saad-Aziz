'use client'

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { TOKEN_CONTRACT_ADDRESS, TOKEN_ABI } from '@/lib/constants'
import { formatUnits, parseUnits } from 'viem'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export function useToken() {
    const { address, isConnected, chain } = useAccount()
    const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 167012)
    const isWrongNetwork = isConnected && chain?.id !== chainId

    // Read operations
    const { data: name, isLoading: isLoadingName, error: nameError } = useReadContract({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'name',
    })

    const { data: symbol, isLoading: isLoadingSymbol, error: symbolError } = useReadContract({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'symbol',
    })

    const { data: decimals } = useReadContract({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'decimals',
    })

    const { data: totalSupply } = useReadContract({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'totalSupply',
    })

    const { data: owner } = useReadContract({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'owner',
    })

    const { data: balance, refetch: refetchBalance, error: balanceError } = useReadContract({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address
        }
    })

    // Debugging logs
    useEffect(() => {
        if (isConnected) {
            console.log('--- Token Debug Info ---')
            console.log('Chain:', chain?.name, 'ID:', chain?.id)
            console.log('Expected ID:', chainId)
            console.log('Contract:', TOKEN_CONTRACT_ADDRESS)
            if (nameError) console.error('Name Error:', nameError)
            if (symbolError) console.error('Symbol Error:', symbolError)
            if (balanceError) console.error('Balance Error:', balanceError)
        }
    }, [isConnected, chain, nameError, symbolError, balanceError, chainId, name, symbol])

    // Write operations
    const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract()

    const { isLoading: isTxConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    useEffect(() => {
        if (isTxSuccess) {
            toast.success('Transaction confirmed!')
            refetchBalance()
        }
        if (writeError) {
            // Simplified error messaging for better UX
            const errorMessage = writeError.message?.split('\n')[0] || 'Transaction failed'
            toast.error(errorMessage)
        }
    }, [isTxSuccess, writeError, refetchBalance])

    const transfer = async (to: string, amount: string) => {
        if (!decimals) return
        const value = parseUnits(amount, decimals as number)
        writeContract({
            address: TOKEN_CONTRACT_ADDRESS,
            abi: TOKEN_ABI,
            functionName: 'transfer',
            args: [to as `0x${string}`, value],
        })
    }

    const mint = async (to: string, amount: string) => {
        if (!decimals) return
        const value = parseUnits(amount, decimals as number)
        writeContract({
            address: TOKEN_CONTRACT_ADDRESS,
            abi: TOKEN_ABI,
            functionName: 'mint',
            args: [to as `0x${string}`, value],
        })
    }

    return {
        address,
        isConnected,
        isWrongNetwork,
        chain,
        name: name as string || 'Unknown',
        symbol: symbol as string || '???',
        decimals: decimals as number,
        totalSupply: totalSupply ? formatUnits(totalSupply as bigint, (decimals || 18) as number) : '0',
        balance: balance ? formatUnits(balance as bigint, (decimals || 18) as number) : '0',
        owner: owner as string,
        isOwner: address && owner ? (address as string).toLowerCase() === (owner as string).toLowerCase() : false,
        transfer,
        mint,
        isLoading: isWritePending || isTxConfirming || isLoadingName || isLoadingSymbol,
        txHash: hash,
    }
}
