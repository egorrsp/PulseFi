"use client";

import React, { useEffect, useState } from "react";
import { loadTokenList, TokenConfig } from "@/helpers/lists/token_list";
import { getTokenPriceInUSD } from "@/helpers/wallet_hooks/price-tokens.api";

export function TokenSelector({ onSelect }: { onSelect: (token: TokenConfig) => void }) {
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

export function TokenPriceOrganaiser({ token }: { token: string }) {
  const [amountInDollars, setAmountInDollars] = useState<number | "">("");
  const [amountInTokens, setAmountInTokens] = useState<number | "">("");
  const [isInChange, setIsInChange] = useState<boolean>(false);
  const [tokenRate, setTokenRate] = useState<number | null>(null);
  const [activeField, setActiveField] = useState<"dollars" | "tokens" | null>(null);

  useEffect(() => {
    if (!token) return;
    let mounted = true;
    const fetchRate = async () => {
      try {
        const rate = await getTokenPriceInUSD(token);
        if (mounted) setTokenRate(rate);
      } catch (error) {
        console.error(error);
        if (mounted) setTokenRate(null);
      }
    };
    fetchRate();
    return () => { mounted = false; };
  }, [token]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("stakeAmount");
    if (stored !== null && stored !== "") {
      const n = Number(stored);
      if (!isNaN(n)) setAmountInDollars(n);
    }
  }, []);

  useEffect(() => {
    if (tokenRate == null) return;

    if (amountInDollars !== "" && (activeField === "dollars" || activeField === null)) {
      const dollars = Number(amountInDollars);
      if (!isNaN(dollars)) {
        setAmountInTokens(Number((dollars / tokenRate).toFixed(6)));
      }
      return;
    }

    if (amountInTokens !== "" && activeField === "tokens") {
      const tokens = Number(amountInTokens);
      if (!isNaN(tokens)) {
        setAmountInDollars(Number((tokens * tokenRate).toFixed(2)));
      }
    }
  }, [amountInDollars, amountInTokens, tokenRate, activeField]);

  useEffect(() => {
    if (amountInDollars === "" && amountInTokens === "") return;
    setIsInChange(true);
    const t = setTimeout(() => setIsInChange(false), 500);
    return () => clearTimeout(t);
  }, [amountInDollars, amountInTokens]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (amountInDollars === "") {
      localStorage.removeItem("stakeAmount");
    } else {
      localStorage.setItem("stakeAmount", String(amountInDollars));
    }
  }, [amountInDollars]);

  return (
    <div>
      <p className="text-2xl mb-1">Enter the price...</p>
      <div className="flex md:flex-row flex-col items-center justify-between gap-5">
        <div className="md:w-2/5 w-full flex flex-col gap-3">
          <p>In dollars</p>
          <input
            type="number"
            step="0.01"
            value={amountInDollars === "" ? "" : amountInDollars}
            onFocus={() => setActiveField("dollars")}
            onBlur={() => setActiveField(null)}
            onChange={(e) => {
              const num = e.target.value === "" ? "" : parseFloat(e.target.value);
              setAmountInDollars(isNaN(num as number) ? "" : (num as number));
            }}
            placeholder="Amount"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <img
          className={`w-1/10 p-5 duration-200 ${isInChange ? "rotate-180" : "rotate-0"}`}
          src="/transfer/reload.svg"
        />

        <div className="md:w-2/5 w-full flex flex-col gap-3">
          <p>In tokens</p>
          <input
            type="number"
            step="0.000001"
            value={amountInTokens === "" ? "" : amountInTokens}
            onFocus={() => setActiveField("tokens")}
            onBlur={() => setActiveField(null)}
            onChange={(e) => {
              const num = e.target.value === "" ? "" : parseFloat(e.target.value);
              setAmountInTokens(isNaN(num as number) ? "" : (num as number));
            }}
            placeholder="Amount"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}