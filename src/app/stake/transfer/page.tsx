"use client"

import { TOKEN_LIST } from "@/helpers/lists/token_list";
import { useUserProfile } from "@/helpers/queries/useUserProfile";
import { useUserStore } from "@/helpers/store/useUserStore";
import { useState } from "react";

export default function Page() {

    const [isTokenSelected, setIsTokenSelected] = useState<number | null>(null);

    const connected = useUserStore((s) => s.connected);

    const userQuery = useUserProfile();

    return (
        <>
            {connected ? (
                (!isTokenSelected ? (
                    <>
                        <div className="flex flex-col gap-8">
                            <p className="text-2xl">Select the tokens you want to stake</p>
                            <div className="flex flex-col gap-5 w-full">
                                {TOKEN_LIST && TOKEN_LIST.map((element) => (
                                    <div key={element.key} className="flex flex-row justify-between items-center gap-5">
                                        <div
                                            className="flex flex-row justify-start items-center gap-3 py-3 px-3 cursor-pointer border border-[#2563EB] rounded-md hover:shadow-md shadow-[#2563EB] duration-150 w-full active:shadow-none"
                                            onClick={() => setIsTokenSelected(element.key + 1)}
                                        >
                                            <img src={element.logo} alt={element.name} className="w-8 h-8 rounded-full" />
                                            <p className="text-2xl">{element.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-end">
                            <button
                                className="px-3 py-1 border-2 rounded-md cursor-pointer border-red-500 text-red-500 uppercase text-2xl active:shadow-md"
                                onClick={() => setIsTokenSelected(null)}
                            >
                                Return
                            </button>
                        </div>
                        <div className="flex flex-col gap-8">
                            <p className="text-2xl">You selected: <span className="text-[#2563EB]">{TOKEN_LIST.find(t => t.key + 1 === isTokenSelected)?.name}</span> - good choice!</p>
                            <p className="text-xl italic text-[#22C55E]">Now, enter the amount you want to stake</p>

                            <div>
                                <p className="text-2xl mb-1">Enter the price...</p>
                                <div className="flex md:flex-row flex-col gap-5">
                                    <div className="md:w-1/2 w-full flex flex-col gap-3">
                                        <p>In dollars</p>
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="md:w-1/2 w-full flex flex-col gap-3">
                                        <p>In tokens</p>
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ))
            ) : (
                <p>Пожалуйста, подключите кошелек</p>
            )}
        </>
    )
}