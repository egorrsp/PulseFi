"use client";

import React, { useEffect, useState } from "react";
import { loadTokenList, TokenConfig } from "@/helpers/lists/token_list";

export default function TokenSelector({ onSelect }: { onSelect: (token: TokenConfig) => void }) {
    const [tokens, setTokens] = useState<TokenConfig[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        loadTokenList()
            .then(list => {
                if (!mounted) return;
                setTokens(list);
            })
            .catch((e) => {
                console.error("Failed to load token list", e);
                if (!mounted) return;
                setError("Failed to load tokens");
                setTokens([]);
            });
        return () => { mounted = false; };
    }, []);

    if (error) return <p>{error}</p>;
    if (tokens === null) return <p>Loading tokens...</p>;
    if (tokens.length === 0) return <p>No tokens available</p>;

    return (
        <div className="flex flex-col gap-5 w-full">
            {tokens.map((element) => (
                <div key={element.address.toBase58()} className="flex flex-row justify-between items-center gap-5">
                    <div
                        className="flex flex-row justify-start items-center gap-3 py-3 px-3 cursor-pointer border border-[#2563EB] rounded-md hover:shadow-md shadow-[#2563EB] duration-150 w-full active:shadow-none"
                        onClick={() => onSelect(element)}
                    >
                        <img src={element.logo} alt={element.name} className="w-8 h-8 rounded-full" />
                        <p className="text-2xl ml-2">{element.name}</p>
                        <p className="text-sm text-gray-400 ml-3 break-all">{element.address.toBase58()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}