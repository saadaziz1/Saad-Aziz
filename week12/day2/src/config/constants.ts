import { defineChain } from 'viem';

export const KASPLEX_ZKEVM_TESTNET = defineChain({
    id: 167012,
    name: 'Kasplex zkEVM Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'KAS',
        symbol: 'KAS',
    },
    rpcUrls: {
        default: {
            http: [process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.testnet.kasplextest.xyz'],
        },
        public: {
            http: [process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.testnet.kasplextest.xyz'],
        },
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'https://explorer.testnet.kasplextest.xyz' },
    },
    testnet: true,
});

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
export const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
export const METADATA_CID = process.env.NEXT_PUBLIC_METADATA_CID || 'bafybeiczegps6oein7miswjqhtgdyu44u7migwrlpieivhqlv5im4uqgpq';
export const METADATA_FOLDER_CID = process.env.NEXT_PUBLIC_METADATA_FOLDER_CID || '';
// Metadata files are locally at /metadata/*.json
