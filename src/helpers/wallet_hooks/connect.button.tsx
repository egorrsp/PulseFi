'use client'

import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";

export const ConnectButton = () => {
    const { connected, connect, disconnect, wallet, wallets, select } = useWallet();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) {
        return (
            <div className="flex sm:flex-row flex-col-reverse items-center justify-around gap-10 p-5 border-4 border-gray-400 rounded-md">
                <div className="flex flex-col items-center gap-5">
                    <p>Loading wallet...</p>
                    <div className="px-4 py-2 bg-gray-300 text-white rounded">Loading...</div>
                </div>
                <img src='/stake/wallet-money-svgrepo-com.svg' className="w-32 text-black" alt='wallet' />
            </div>
        );
    }

    if (connected) {
        return (
            <div className="flex sm:flex-row flex-col-reverse items-center justify-around gap-10 p-5 border-4 border-[#2563EB] rounded-md">
                <div className="flex flex-col items-center gap-5">
                    <p>Connected: {wallet?.adapter.name}</p>
                    <button
                        onClick={() => disconnect().then(() => console.log("disconnected"))}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Disable
                    </button>
                </div>
                <img src='/stake/wallet-money-svgrepo-com.svg' className="w-32 text-black" alt='wallet' />
            </div>
        );
    }

    const installedWallets = wallets.filter((w) => w.readyState === "Installed");

    if (installedWallets.length === 0) {
        return (
            <div className="flex sm:flex-row flex-col-reverse items-center justify-around gap-10 p-5 border-4 border-purple-600 rounded-md">
                <div className="flex flex-col items-center gap-5">
                    <p>No wallet detected</p>
                    <a
                        href="https://phantom.app/download"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-purple-600 text-white rounded"
                    >
                        Install Phantom
                    </a>
                </div>
                <img src='/stake/wallet-money-svgrepo-com.svg' className="w-32 text-black" alt='wallet' />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-8 p-5 border-4 border-red-500 rounded-md">
            <p className="text-lg font-medium">Choose a wallet to connect</p>
            <div className="grid sm:grid-cols-3 gap-4">
                {installedWallets.map((w) => (
                    <button
                        key={w.adapter.name}
                        onClick={async () => {
                            try {
                                select(w.adapter.name);
                                await connect();
                            } catch (err) {
                                console.error(err);
                            }
                        }}
                        className="flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all"
                    >
                        <img
                            src={w.adapter.icon}
                            alt={w.adapter.name}
                            className="w-6 h-6"
                        />
                        <span>{w.adapter.name}</span>
                    </button>
                ))}
            </div>
            <img src='/stake/wallet-money-svgrepo-com.svg' className="w-32 text-black" alt='wallet' />
        </div>
    );
};