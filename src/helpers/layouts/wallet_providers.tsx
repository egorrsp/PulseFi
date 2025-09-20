'use client';

import { ReactNode, useMemo, useState } from 'react';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    ConnectionProvider,
    WalletProvider
} from "@solana/wallet-adapter-react";
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function Providers({ children }: { children: ReactNode }) {
    const network = WalletAdapterNetwork.Testnet;
    const endpoint = "http://127.0.0.1:8899";

    const wallets = useMemo(
        () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
        []
    );

    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    {children}
                </WalletProvider>
            </ConnectionProvider>
        </QueryClientProvider>
    );
}