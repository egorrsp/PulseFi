'use client'

import { ConnectButton } from "@/helpers/wallet_hooks/connect.button";
import { TopStakeInfo, WalletStakeInfo } from "@/components/pages/stake/stake_ui";
import { useUserStore } from "@/helpers/store/useUserStore";
import { user_profile_info, token_storage_info } from "@/helpers/wallet_hooks/wallet.hooks";
import { useUserProfile } from "@/helpers/queries/useUserProfile";
import { UserToken } from "@/types/programId";

export default function Page() {

    const publicKey = useUserStore((s) => s.publicKey);
    const connected = useUserStore((s) => s.connected);
    const program = useUserStore((s) => s.program);

    try {
        const [bump, pda] = user_profile_info();
    } catch (e) {
        console.log(e);
    }

    try {
        const ts_info = token_storage_info();
    } catch (e) {
        console.log(e);
    }

    const userQuery = useUserProfile();

    if (userQuery.isLoading) {
        return <div>Loading...</div>;
    }

    if (userQuery.isError) {
        return <div>Error: {String(userQuery.error)}</div>;
    }

    const user = userQuery.data as UserToken | undefined;

    return (
        <>
            {connected ? (
                <div className="flex flex-col gap-16">
                    <TopStakeInfo 
                        publicKey={publicKey}
                    />
                    <WalletStakeInfo
                        amountStaked={user?.staked_amount} // Replace with actual staked info
                        awardsPaid={1000}
                        lastPaymentDate={"2024-06-01"}
                    />
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