import { getDefaultConfig } from 'connectkit';
import { createConfig, http } from 'wagmi';
import { KASPLEX_ZKEVM_TESTNET } from './constants';

export const config = createConfig(
    getDefaultConfig({
        // Your dApps chains
        chains: [KASPLEX_ZKEVM_TESTNET],
        transports: {
            [KASPLEX_ZKEVM_TESTNET.id]: http(),
        },

        // Required API Keys
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',

        // Required App Info
        appName: 'Demon Slayer NFT Collection',

        // Optional App Info
        appDescription: 'Exclusive Demon Slayer NFT Collection on Kasplex zkEVM',
        appUrl: 'https://family.co', // your app's url
        appIcon: 'https://family.co/logo.png', // your app's icon
    })
);
