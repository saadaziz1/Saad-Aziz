'use client';

import { ConnectKitButton } from 'connectkit';
import { Button } from '../atoms/Button';
import { Wallet } from 'lucide-react';

export const ConnectButton = () => {
    return (
        <ConnectKitButton.Custom>
            {({ isConnected, isConnecting, show, address, truncatedAddress, ensName }) => {
                return (
                    <Button
                        onClick={show}
                        variant={isConnected ? 'secondary' : 'primary'}
                        isLoading={isConnecting}
                        className="font-mono min-w-[150px]"
                    >
                        <Wallet className="w-4 h-4 mr-2" />
                        {isConnected ? ensName ?? truncatedAddress : 'Connect Soul'}
                    </Button>
                );
            }}
        </ConnectKitButton.Custom>
    );
};
