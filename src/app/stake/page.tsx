'use client'

import wallet_hooks from "@/helpers/wallet.hooks";
import { ConnectButton } from "@/helpers/connect.button";

export default function Page() {

    const { 
        publicKey,
        wallet,
        connected,
        programId,
        provider,
        program
     } = wallet_hooks();

    return (
        <>
            {connected ? (
                <div className="flex flex-row justify-between items-center gap-16">
                    <div>
                        <h4 className="text-6xl font-sans font-semibold text-[#111827]">
                            GM
                        </h4>
                        <p className='text-[#111827] text-md'>Here you can stake your tokens</p>
                    </div>
                    <div className="flex flex-col justify-end gap-2 border border-[#22C55E] p-5 rounded-md group">
                        <div className="flex flex-row w-full justify-between items-center">
                            <p className="text-left text-2xl text-[#22C55E] group-hover:font-bold duration-200 easy-in-out">Your wallet</p>
                            <p className="text-2xl text-[#22C55E] group-hover:font-bold duration-200 easy-in-out ">＄</p>
                        </div>
                        <p className='font-sans '>Wallet address: {publicKey?.toBase58()}</p>
                        <p></p>
                    </div>
                </div>
            ) : (
                <div>
                    <p>Пожалуйста, подключите кошелек</p>
                    <ConnectButton />
                </div>
            )}
        </>
    )
}