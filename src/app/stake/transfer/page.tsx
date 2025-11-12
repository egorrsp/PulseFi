"use client";


import { ReturnButton } from "@/components/pages/transfer/buttons";
import { ConfirmButton, TokenPriceOrganaiser } from "@/components/pages/transfer/transfer_ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTokenBySymbol, type TokenConfig } from "@/helpers/lists/token_list";
import { useWallet } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";

export default function Page() {
    const searchParams = useSearchParams();
    const selectedTokenName = searchParams.get("token");
    const [selectedToken, setSelectedToken] = useState<TokenConfig | null>(null);

    const [amount, setAmount] = useState<number>(0);

    const { connected } = useWallet();
    const router = useRouter();

    useEffect(() => {
        if (!selectedTokenName) {
            router.push("/stake");
            return;
        }

        getTokenBySymbol(selectedTokenName)
            .then((res) => {
                if (!res) {
                    router.push("/stake");
                    return;
                }
                setSelectedToken(res);
            })
            .catch(() => {
                router.push("/stake");
            });
    }, [connected, selectedTokenName, router]);

    useEffect(() => {
        const errorFallback = setTimeout(() => {
            if (!connected) {
                router.push("/stake");
                return;
            }
        }, 100);

        clearTimeout(errorFallback);
    }, [])

    if (!selectedTokenName) {
        return null;
    }

    return (
        <>
            <div className="flex justify-end">
                <ReturnButton onReturn={() => router.push("/stake/choise")} />
            </div>

            <div className="flex flex-col gap-8">
                <p className="text-2xl">
                    You selected:{" "}
                    <span className="text-[#2563EB]">{selectedTokenName}</span>{" "}
                    - good choice!

                </p>

                <div className="flex items-center gap-4">
                    {selectedToken?.logo && (
                        <img
                            src={selectedToken.logo}
                            alt={selectedToken.name}
                            className="w-10 h-10 rounded-full"
                        />
                    )}
                    <div className="text-sm text-gray-500 break-all">
                        {selectedToken?.address.toBase58()}
                    </div>
                </div>

                <p className="text-xl italic text-[#22C55E]">
                    Now, enter the amount you want to stake
                </p>

                <TokenPriceOrganaiser token={selectedTokenName} onChange={setAmount} />
                {selectedToken?.address && typeof amount === "number" && !isNaN(amount) && amount > 0 ? (
                    <ConfirmButton
                        mint={selectedToken.address.toBase58()}
                        amount={new BN(Math.floor(amount * 10 ** selectedToken.decimals))}
                    />
                ) : (
                    <p>We can't identify mint or amount</p>
                )}
            </div>
        </>
    );
}