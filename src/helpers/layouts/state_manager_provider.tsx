'use client';

import { useEffect } from "react";
import { wallet_hooks } from "@/helpers/wallet_hooks/wallet-hooks";
import { useUserStore } from "@/helpers/store/useUserStore";

export function UserSyncProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, connected, provider, program } = wallet_hooks();
  const setUser = useUserStore((s) => s.updateUser);
  const clearUser = useUserStore((s) => s.clearUser);
  const pk = publicKey?.toBase58();


  useEffect(() => {
    if (connected && publicKey) {
      setUser({ publicKey: pk, connected, provider, program });
    } else {
      clearUser();
    }
  }, [connected, publicKey, provider, program, setUser, clearUser]);

  return <>{children}</>;
}