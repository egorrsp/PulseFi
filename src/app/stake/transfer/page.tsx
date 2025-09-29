"use client";

import { ReturnButton } from "@/components/pages/transfer/buttons";
import { TokenPriceOrganaiser } from "@/components/pages/transfer/transfer_ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTokenBySymbol, type TokenConfig } from "@/helpers/lists/token_list";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Page() {
    const searchParams = useSearchParams();
    const selectedTokenName = searchParams.get("token");
    const [selectedToken, setSelectedToken] = useState<TokenConfig | null>(null);

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

                <TokenPriceOrganaiser token={selectedTokenName} />

                <div className="flex sm:flex-row flex-col sm:gap-32 gap-10 justify-start">
                    <button
                        className="border-2 border-[#2563EB] bg-[#2563EB] text-white hover:bg-white px-5 py-3 text-2xl rounded-md cursor-pointer shadow-md active:shadow-none active:border-[#22C55E] active:text-[#22C55E] hover:text-[#2563EB] duration-200 transition"
                        onClick={() => { }}
                    >
                        Accept
                    </button>
                    <div className="flex flex-col">
                        <p className="text-xl">Are you sure about your choice?</p>
                        <p className="text-lg text-gray-400">By clicking the button, you accept the 
                            <span 
                                className="text-[#22C55E] hover:border-b border-[#22C55E] duration-200 transition cursor-pointer mx-2"
                                onClick={() => router.push("/institutions")}
                            >
                                user agreement
                            </span>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}