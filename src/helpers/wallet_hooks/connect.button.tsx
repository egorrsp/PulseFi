'use client'

import { useWallet } from "@solana/wallet-adapter-react";

export const ConnectButton = () => {
    const { connected, connect, disconnect, wallet } = useWallet();

    if (connected) {
        return (
            <div>
                <p>Подключен: {wallet?.adapter.name}</p>
                <button onClick={() => disconnect()}>Отключить</button>
            </div>
        );
    }

    return (
        <button onClick={() => connect()}>
            Подключить кошелёк
        </button>
    );
};