'use client'

import { ConnectButton } from "@/helpers/wallet_hooks/connect.button";
import { TopStakeInfo, WalletStakeInfo } from "@/components/pages/stake/stake_ui";
import { useUserStore } from "@/helpers/store/useUserStore";
import { user_profile_info } from "@/helpers/wallet_hooks/wallet.hooks";

export default function Page() {

    const publicKey = useUserStore((s) => s.publicKey);
    const connected = useUserStore((s) => s.connected);

    try {
        const [bump, pda] = user_profile_info();
    } catch (e) {
        console.log(e);
    }

    return (
        <>
            {connected ? (
                <div className="flex flex-col gap-16">
                    <TopStakeInfo 
                        publicKey={publicKey}
                    />
                    <WalletStakeInfo
                        amountStaked={1000} // Replace with actual staked info
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