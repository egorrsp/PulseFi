'use client'

import { ConnectButton } from "@/helpers/wallet_hooks/connect.button";
import { CreateUserProfileUI, TopStakeInfo, WalletStakeInfo } from "@/components/pages/stake/stake_ui";
import { useUserStore } from "@/helpers/store/useUserStore";
import { useUserProfile } from "@/helpers/queries/useUserProfile";
import { UserProfile } from "@/types/programId";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";

export default function Page() {
  const publicKey = useUserStore((s) => s.publicKey);
  const connected = useUserStore((s) => s.connected);

  const userQuery = useUserProfile();
  const [user, setUser] = useState<{
    ready: boolean;
    account?: UserProfile;
    error?: string;
    pda: PublicKey;
  } | null>(null);

  useEffect(() => {
    if (userQuery.data?.pda && !user) {
      const { ready, account, error, pda } = userQuery.data;
      setUser({ ready, account, error, pda });
    }
  }, [userQuery.data, user]);

  if (userQuery.isLoading) return <div>Loading...</div>;

  return (
    <>
      {!userQuery.isError && user ? (
        <div className="flex flex-col gap-16">
          <TopStakeInfo publicKey={publicKey} />
          <WalletStakeInfo
            amountStaked={BigInt(1000)}
            awardsPaid={BigInt(150)}
            lastPaymentDate="2024-06-01"
            err={user.error}
          />
        </div>
      ) : connected ? (
        <CreateUserProfileUI pda={userQuery.data?.pda} />
      ) : (
        <div>
          <p>Пожалуйста, подключите кошелек</p>
          <ConnectButton />
        </div>
      )}
    </>
  );
}