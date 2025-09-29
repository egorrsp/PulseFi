'use client'

import { ConnectButton } from "@/helpers/wallet_hooks/connect.button";
import { CreateUserProfileUI, StakeButton, TopStakeInfo, WalletStakeInfo, UnstakeButton } from "@/components/pages/stake/stake_ui";
import { useUserStore } from "@/helpers/store/useUserStore";
import { useUserProfile } from "@/helpers/queries/useUserProfile";
import { UserProfile } from "@/types/programId";
import { useEffect, useState } from "react";

//dev only
import { requestAirdropForLocalDev } from "@/helpers/wallet_hooks/wallet.hooks";

export default function Page() {
    const connected = useUserStore((s) => s.connected);
    const userQuery = useUserProfile();

    if (userQuery.isLoading) {
        return <div>Loading...</div>;
    }

    const { ready, account, error } = userQuery.data ?? {};

    return (
        <>
            {connected ?
                (ready ? (
                    <div className="flex flex-col gap-16">
                        <TopStakeInfo />
                        <div className="flex md:flex-row flex-col gap-5">
                            <StakeButton />
                            <UnstakeButton />
                        </div>
                        <WalletStakeInfo
                            registerDate="2024-06-01"
                            tokens={account?.staked_tokens}
                            err={error}
                        />
                    </div>
                ) : (
                    <CreateUserProfileUI />
                )) : (
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