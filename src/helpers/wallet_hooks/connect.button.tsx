'use client'

import { useWallet } from "@solana/wallet-adapter-react";

export const ConnectButton = () => {
    const { connected, connect, disconnect, wallet, wallets } = useWallet();

    const installedWallets = wallets.filter((w) => w.readyState === "Installed");

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

    if (installedWallets.length === 0) {
        return (
            <div className="flex sm:flex-row flex-col-reverse items-center justify-around gap-10 p-5 border-4 border-purple-600 rounded-md">
                <div className="flex flex-col items-center gap-5">
                    <p>Connected: {wallet?.adapter.name}</p>
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
        <div className="flex sm:flex-row flex-col-reverse items-center justify-around gap-10 p-5 border-4 border-red-500 rounded-md">
            <div className="flex flex-col items-center gap-5">
                <p>Connected: {wallet?.adapter.name}</p>
                <button
                    onClick={() => connect().catch(console.error)}
                    className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
                >
                    Connect a wallet
                </button>
            </div>
            <img src='/stake/wallet-money-svgrepo-com.svg' className="w-32 text-black" alt='wallet' />
        </div>
    );
};