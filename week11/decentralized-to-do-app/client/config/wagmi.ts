import { http, createConfig } from 'wagmi'


const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 167012;
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.kasplextest.xyz';
const blockExplorerUrl = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || 'https://scan.kasplextest.xyz';

export const kasplexTestnet = {
    id: chainId,
    name: 'Kasplex Testnet',
    nativeCurrency: { name: 'Kasplex', symbol: 'KAS', decimals: 18 },
    rpcUrls: {
        default: { http: [rpcUrl] },
    },
    blockExplorers: {
        default: { name: 'KasplexScan', url: blockExplorerUrl },
    },
} as const

export const config = createConfig({
    chains: [kasplexTestnet],
    transports: {
        [kasplexTestnet.id]: http(),

    },
})
