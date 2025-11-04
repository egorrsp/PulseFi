'use client'

import { ConnectButton } from "@/helpers/wallet_hooks/connect_button";
import { 
    CreateUserProfileUI, 
    StakeButton, 
    TopStakeInfo, 
    WalletStakeInfo, 
    UnstakeButton, 
    Verification, 
    ProfileButton 
} from "@/components/pages/stake/stake_ui";
import { useUserStore } from "@/helpers/store/useUserStore";
import { useUserProfile } from "@/helpers/queries/useUserProfile";
import { useEffect, useState } from "react";
import { checkAuthentication } from "@/helpers/server_api/auth";
import { createUser, getUserInfo } from "@/helpers/server_api/user_info";
import { UserInfo } from "@/types/user";

// dev only
import { requestAirdropForLocalDev } from "@/helpers/helpers.dev/airdrop";

export default function Page() {
    const pubkey = useUserStore((s) => s.publicKey);
    const connected = useUserStore((s) => s.connected);
    const userQuery = useUserProfile();

    const [isVerify, setIsVerify] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        const autoVerify = async () => {
            try {
                const response = await checkAuthentication();
                if (response.data.status === "protected") {
                    setIsVerify(true);
                }
            } catch {
                setIsVerify(false);
            }
        };
        autoVerify();
    }, []);

    useEffect(() => {
        const autoSetProfile = async () => {
            if (!isVerify || !pubkey) return;
            try {
                const response = await getUserInfo(pubkey);
                setUser(response);
            } catch (err: any) {
                if (err.response?.status === 404) {
                    try {
                        await createUser(pubkey);
                        const newUser = await getUserInfo(pubkey);
                        setUser(newUser);
                    } catch (createErr) {
                        console.error("Error creating user:", createErr);
                    }
                } else {
                    console.error("Error retrieving user:", err);
                }
            }
        };
        autoSetProfile();
    }, [isVerify, pubkey]);

    useEffect(() => {
        if (user) {
            useUserStore.getState().updateUser({
                username: user.username,
                rewards: user.rewards,
                createdAt: user.created_at,
                lastSeen: user.last_seen,
                banned: user.banned,
                banReason: user.ban_reason,
            })
        }
    }, [user])

    if (userQuery.isLoading) return <div>Loading...</div>;
    const { ready, account, error } = userQuery.data ?? {};

    if (isLoading) return <div>Verifying...</div>;

    return (
        <>
            {connected ? (
                isVerify ? (
                    ready ? (
                        <div className="flex flex-col gap-16">
                            <TopStakeInfo username={user?.username} />
                            <div className="flex md:flex-row flex-col gap-5">
                                <StakeButton />
                                <UnstakeButton />
                                <ProfileButton />
                            </div>
                            <WalletStakeInfo
                                registerDate={account?.initTime}
                                tokens={account?.stakedTokens}
                                err={error}
                            />
                        </div>
                    ) : (
                        <CreateUserProfileUI username={user?.username} />
                    )
                ) : (
                    <Verification onLoading={setIsLoading} onVerified={setIsVerify} />
                )
            ) : (
                <ConnectButton />
            )}

            {/* dev only */}
            <button
                className="px-3 py-2 bg-amber-600 active:bg-amber-400 text-black 
                    font-sans duration-200 cursor-pointer mt-40 rounded-sm"
                onClick={() => requestAirdropForLocalDev()}
            >
                Airdrop (local)
            </button>
        </>
    );
}