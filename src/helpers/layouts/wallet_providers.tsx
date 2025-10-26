'use client';

import { ReactNode, useMemo, useState } from 'react';
import {
    ConnectionProvider,
    WalletProvider
} from "@solana/wallet-adapter-react";
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CONFIG } from '@/config';

export function Providers({ children }: { children: ReactNode }) {
    const endpoint = CONFIG.network

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