'use client'

import { http, createConfig, WagmiProvider } from 'wagmi'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { defineChain } from 'viem'

// Define Kasplex zkEVM Testnet
const kasplexTestnet = defineChain({
    id: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 167012),
    name: process.env.NEXT_PUBLIC_CHAIN_NAME || 'Kasplex zkEVM Testnet',
    nativeCurrency: {
        decimals: Number(process.env.NEXT_PUBLIC_CURRENCY_DECIMALS || 18),
        name: process.env.NEXT_PUBLIC_CURRENCY_NAME || 'Kaspa',
        symbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'KAS',
    },
    rpcUrls: {
        default: { http: [process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.kasplextest.xyz'] },
    },
    blockExplorers: {
        default: { name: 'Explorer', url: process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://explorer.testnet.kasplextest.xyz/' },
    },
    testnet: true,
})

const config = createConfig(
    getDefaultConfig({
        // Your dApps chains
        chains: [kasplexTestnet],
        transports: {
            [kasplexTestnet.id]: http(),
        },

        // Required API Keys
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',

        // Required App Info
        appName: 'BhaiKaSikka',
        appDescription: 'A premium ERC-20 token dashboard on Kasplex',
    }),
)

const queryClient = new QueryClient()

export const Web3Provider = ({ children }: { children: ReactNode }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider theme="auto" mode="dark">
                    {children}
                </ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
