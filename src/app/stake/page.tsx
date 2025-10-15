'use client'

import { ConnectButton } from "@/helpers/wallet_hooks/connect.button";
import { CreateUserProfileUI, StakeButton, TopStakeInfo, WalletStakeInfo, UnstakeButton } from "@/components/pages/stake/stake_ui";
import { useUserStore } from "@/helpers/store/useUserStore";
import { useUserProfile } from "@/helpers/queries/useUserProfile";
import { useEffect, useState } from "react";
import { authenticateWithWallet } from "@/helpers/server_api/auth";


//dev only
import { requestAirdropForLocalDev } from "@/helpers/helpers.dev/airdrop";


export default function Page() {
    const connected = useUserStore((s) => s.connected);
    const userQuery = useUserProfile();
    const [isVerify, setIsVerify] = useState<boolean>(false)

    const verify = () => {
        try {
            const response = authenticateWithWallet()
            console.log(response)
            setIsVerify(true)
        } catch (err) {
            console.log(err)
        }
    }

    if (userQuery.isLoading) {
        return <div>Loading...</div>;
    }

    const { ready, account, error } = userQuery.data ?? {};

    return (
        <>
            {connected ? (
                isVerify ? (
                    ready === true ? (
                        <>
                            <div className="flex flex-col gap-16">
                                <TopStakeInfo />
                                <div className="flex md:flex-row flex-col gap-5">
                                    <StakeButton />
                                    <UnstakeButton />
                                </div>
                                <WalletStakeInfo
                                    registerDate={account?.initTime}
                                    tokens={account?.stakedTokens}
                                    err={error}
                                />
                            </div>
                        </>
                    ) : (
                        <CreateUserProfileUI />
                    )
                ) : (
                    <>
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col">
                                <p className="text-2xl">Please, verify before starting use platform</p>
                                <p>Verification is necessary to prevent malicious attacks on the network</p>
                            </div>

                            <button
                                className="px-3 py-2 bg-[#22C55E] text-white rounded-md cursor-pointer"
                                onClick={() => verify()}
                            >
                                Verify
                            </button>
                        </div>
                    </>
                )
            ) : (
                <div>
                    <ConnectButton />
                </div>
            )}

            {/* dev only */}
            <button
                className="px-3 py-2 bg-amber-600 active:bg-amber-400 text-black font-sans duration-200 cursor-pointer mt-40 rounded-sm"
                onClick={() => requestAirdropForLocalDev()}
            >
                Airdrop (local)
            </button>
        </>
    );
}