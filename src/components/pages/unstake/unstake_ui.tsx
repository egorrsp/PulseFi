"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";


interface TopUnstakeProps {
    username: string;
    publicKey: string;
}

export function TopUnstake(props: TopUnstakeProps) {

    const [open, setOpen] = useState<boolean>(false)

    return(
        <>
            <div className="w-full items-center justify-between">
                <div className="flex flex-col items-start">
                    <p className="text-6xl uppercase font-sans font-semibold">Unstake</p>
                    <div className="flex flex-row gap-2">
                        <p className="font-sans text-2xl font-medium">from the account:</p>
                        <p className="font-sans text-2xl font-medium text-[#2563EB]">{props.username}</p>
                    </div>
                    <div className="flex flex-row gap-2 items-start">
                        <p className="font-sans text-2xl font-medium">with wallet:</p>
                        <div className="flex flex-col">
                            <p className="font-sans text-2xl font-medium text-[#2563EB]">{!open ? props.publicKey.slice(0, 13) + "..." : props.publicKey}</p>
                            <p
                                className="font-sans text-lg font-medium cursor-pointer text-gray-400"
                                onClick={() => setOpen((prev) => !prev)}
                            >
                                {!open ? "show full key" : "show part of the key"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

interface TokenListProps {
    tokens?: string[];
}

export function TokenListUnstake(props: TokenListProps) {

    const router = useRouter();

    if (!props.tokens) return <p className="text-xl">You don't have any staked tokens yet</p>

    return(
        <>
            <div className="w-full">
                <p className="text-xl mb-6">The tokens that you have:</p>
                {props.tokens.map((token) => (
                    <div 
                        className="flex items-center justify-start cursor-pointer 
                        px-3 py-3 bg-white border border-[#2563EB] rounded-md
                        hover:bg-[#2563EB] hover:text-white ease-in-out duration-150"
                        onClick={() => router.push(`/stake/unstake/confirm?token=${token}`)}
                    >
                        <p className="text-xl">{token}</p>
                    </div>
                ))}
            </div>
        </>
    )
}