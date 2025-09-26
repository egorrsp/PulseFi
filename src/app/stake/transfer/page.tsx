"use client";

import { ReturnButton } from "@/components/pages/transfer/buttons";
import TokenSelector from "@/components/pages/transfer/transfer_ui";
import { useUserStore } from "@/helpers/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { TokenConfig } from "@/helpers/lists/token_list";
import { getTokenPriceInUSD } from "@/helpers/wallet_hooks/price-tokens.api";

export default function Page() {
    const [selectedToken, setSelectedToken] = useState<TokenConfig | null>(null);
    const [amountInDollars, setAmountInDollars] = useState<number | "">("");
    const [amountInTokens, setAmountInTokens] = useState<number | "">("");
    const [isInChange, setIsInChange] = useState<boolean>(false);
    const [tokenRate, setTokenRate] = useState<number | null>(null)

    const connected = useUserStore((s) => s.connected);

    const router = useRouter();

    useEffect(() => {
        const raw = localStorage.getItem("stakeAmount");
        const v = raw ? parseFloat(raw) : 0;
        setAmountInDollars(isNaN(v) ? 0 : v);
    }, []);

    useEffect(() => {
        if (!connected) {
            router.push("/stake");
        }
    }, [connected, router]);

    useEffect(() => {
        if (!selectedToken) return;

        const fetchRate = async () => {
            try {
                const rate = await getTokenPriceInUSD(selectedToken.address.toBase58());
                setTokenRate(rate);
            } catch (error) {
                console.error(error);
                setTokenRate(null);
            }
        };

        fetchRate();
    }, [selectedToken]);

    useEffect(() => {
        if (tokenRate && amountInDollars !== "") {
            setAmountInTokens(amountInDollars / tokenRate);
        }
    }, [amountInDollars, tokenRate]);

    useEffect(() => {
        if (tokenRate && amountInTokens !== "") {
            setAmountInDollars(amountInTokens * tokenRate);
        }
    }, [amountInTokens, tokenRate]);

    useEffect(() => {
        if (amountInDollars === "" && amountInTokens === "") return;

        setIsInChange(true);
        const timeoutId = setTimeout(() => setIsInChange(false), 500);

        return () => clearTimeout(timeoutId);
    }, [amountInDollars, amountInTokens]);

    if (!connected) return <p>Пожалуйста, подключите кошелек</p>;

    return (
        <>
            {!selectedToken ? (
                <TokenSelector onSelect={(token) => setSelectedToken(token)} />
            ) : (
                <>
                    <div className="flex justify-end">
                        <ReturnButton onReturn={() => setSelectedToken(null)} />
                    </div>

                    <div className="flex flex-col gap-8">
                        <p className="text-2xl">
                            You selected:{" "}
                            <span className="text-[#2563EB]">
                                {selectedToken?.name}
                            </span>{" "}
                            - good choice!
                        </p>

                        <div className="flex items-center gap-4">
                            {selectedToken?.logo && <img src={selectedToken.logo} alt={selectedToken.name} className="w-10 h-10 rounded-full" />}
                            <div className="text-sm text-gray-500 break-all">{selectedToken?.address.toBase58()}</div>
                        </div>

                        <p className="text-xl italic text-[#22C55E]">Now, enter the amount you want to stake</p>

                        <div>
                            <p className="text-2xl mb-1">Enter the price...</p>
                            <div className="flex md:flex-row flex-col items-center justify-between gap-5">
                                <div className="md:w-2/5 w-full flex flex-col gap-3">
                                    <p>In dollars</p>
                                    <input
                                        type="number"
                                        value={amountInDollars}
                                        onChange={(e) => {
                                            const num = e.target.value === "" ? "" : parseFloat(e.target.value);
                                            setAmountInDollars(num === "" || isNaN(num) ? "" : num);
                                        }}
                                        placeholder="Amount"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <img className={`w-1/10 p-5 duration-200 ${isInChange ? "rotate-180" : "rotate-0"}`} src="/transfer/reload.svg" />
                                <div className="md:w-2/5 w-full flex flex-col gap-3">
                                    <p>In tokens</p>
                                    <input
                                        type="number"
                                        value={amountInTokens}
                                        onChange={(e) => {
                                            const num = e.target.value === "" ? "" : parseFloat(e.target.value);
                                            setAmountInTokens(num === "" || isNaN(num) ? "" : num);
                                        }}
                                        placeholder="Amount"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}