"use client";

import { GetSecondLevelAccount } from "@/helpers/wallet_hooks/wallet-hooks";
import { PublicKey } from "@solana/web3.js";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { useUserStore } from "@/helpers/store/useUserStore";

export type SecondLevelPda = {
    user: PublicKey;
    token_mint: PublicKey;
    staked_amount: anchor.BN;
    reward_debt: anchor.BN;
    last_reward_time: anchor.BN;
    ata: PublicKey;
};

export default function Page() {
    const searchParams = useSearchParams();
    const selectedTokenName = searchParams.get("token");
    const [tokenAccountInfo, setTokenAccountInfo] = useState<SecondLevelPda | null>(null);
    const { program, publicKey, connected } = useUserStore();

    useEffect(() => {
        const fetchInfo = async () => {
            if (!selectedTokenName || !program || !connected || !publicKey) return;
            try {
                const response = await GetSecondLevelAccount(selectedTokenName);
                setTokenAccountInfo(response as SecondLevelPda);
            } catch (err) {
                console.error("Ошибка при загрузке PDA:", err);
            }
        };

        fetchInfo();
    }, [selectedTokenName, program, connected, publicKey]);

    return (
        <div className="w-full p-4">
            <p className="text-lg font-semibold">Token: {selectedTokenName}</p>

            {tokenAccountInfo ? (
                <div className="mt-3 space-y-2 text-sm">
                    <p><strong>User:</strong> {tokenAccountInfo.user?.toBase58()}</p>
                    <p><strong>Mint:</strong> {tokenAccountInfo.token_mint?.toBase58()}</p>
                    <p><strong>Staked:</strong> {tokenAccountInfo.staked_amount?.toString()}</p>
                    <p><strong>Reward Debt:</strong> {tokenAccountInfo.reward_debt?.toString()}</p>
                    <p><strong>Last Reward Time:</strong> {tokenAccountInfo.last_reward_time?.toString()}</p>
                    <p><strong>ATA:</strong> {tokenAccountInfo.ata?.toBase58()}</p>
                </div>
            ) : (
                <p className="text-gray-500 mt-2">Загрузка...</p>
            )}
        </div>
    );
}