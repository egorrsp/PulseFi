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
    const [user, setUser] = useState<{
        ready: boolean;
        account?: UserProfile;
        error?: string;
    } | null>(null);

    useEffect(() => {
        if (userQuery.data?.ready && !user) {
            const { ready, account, error } = userQuery.data;
            setUser({ ready, account, error });
        }
    }, [userQuery.data, user]);

    if (userQuery.isLoading) return <div>Loading...</div>;

    return (
        <>
            {!userQuery.isError && user ? (
                <div className="flex flex-col gap-16">
                    <TopStakeInfo />
                    <div className="flex md:flex-row flex-col gap-5">
                        <StakeButton />
                        <UnstakeButton />
                    </div>
                    <WalletStakeInfo
                        registerDate="2024-06-01"
                        err={user.error}
                    />
                </div>
            ) : connected ? (
                <CreateUserProfileUI />
            ) : (
                <div>
                    <p>Пожалуйста, подключите кошелек</p>
                    <ConnectButton />
                </div>
            )}

            {/*  dev only  */}
            <button 
                className="px-3 py-2 bg-amber-600 active:bg-amber-400 text-black font-sans duration-200 cursor-pointer mt-40 rounded-sm"
                onClick={() => requestAirdropForLocalDev()}
            >
                Airdrop (lochal)
            </button>
        </>
    );
}