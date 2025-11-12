"use client"


import { TopUnstake, TokenListUnstake } from "@/components/pages/unstake/unstake_ui";
import { useUserProfile } from "@/helpers/queries/useUserProfile";
import { checkAuthentication } from "@/helpers/server_api/auth";
import { getUserInfo } from "@/helpers/server_api/user_info";
import { useUserStore } from "@/helpers/store/useUserStore";
import { useSearchParams } from "next/navigation";
import router from "next/router";
import { useEffect, useState } from "react";

export default function Page() {

    const [isLoading, setIsLoading] = useState(false);

    const userQuery_wallet = useUserProfile();

    const {
        publicKey,
        username,
        createdAt,
        lastSeen,
        banned,
        banReason,
        updateUser,
    } = useUserStore();

    const refreshUserInfo = async () => {
        if (publicKey && (!createdAt || !lastSeen)) {
            try {
                const response = await getUserInfo(publicKey);
                updateUser({
                    username: response.username,
                    rewards: response.rewards,
                    createdAt: response.created_at,
                    lastSeen: response.last_seen,
                    banned: response.banned,
                    banReason: response.ban_reason,
                });
            } catch (err) {
                console.error("Error retrieving user:", err);
            }
        }
    };

    useEffect(() => {
        let isMounted = true;
        const autoVerify = async () => {
            setIsLoading(true);
            try {
                const response = await checkAuthentication();
                if (isMounted && response.data.status === "protected") {
                    setIsLoading(false);
                }
            } catch {
                if (isMounted) {
                    setIsLoading(false);
                    router.push("/stake");
                }
            }
        };
        autoVerify();
        return () => {
            isMounted = false;
        };
    }, [router]);

    useEffect(() => {
        if (publicKey) refreshUserInfo();
    }, [publicKey]);

    if (userQuery_wallet.isLoading) return <div>Loading...</div>;
    const { ready1, account, error } = userQuery_wallet.data ?? {};

    if (error) console.log(error);
    if (isLoading) return <div>Verifying...</div>;
    if (!publicKey) return <div>Searching for wallet</div>

    if (banned) return (
        <div>
            <p>You are banned</p>
            <p>Ban reason: {banReason}</p>
        </div>
    )

    return (
        <>
            {ready1 ?
                (
                    <div>
                        <TopUnstake username={username || "Anonimus"} publicKey={publicKey} />
                        <div className="mt-10">
                            <TokenListUnstake tokens={account?.stakedTokens} />
                        </div>
                    </div>
                ) : (
                    <p>Error in fetching wallet info</p>
                )
            }
        </>
    )
}