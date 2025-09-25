import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../store/useUserStore";
import { PublicKey } from "@solana/web3.js";
import { CONFIG } from "../../config";
import { UserProfile } from "@/types/programId";

export function useUserProfile() {
  const program = useUserStore((s) => s.program);
  const publicKey = useUserStore((s) => s.publicKey);

  return useQuery<{
    ready: boolean;
    account?: UserProfile;
    error?: string;
  }>({
    queryKey: ["userProfile", publicKey],
    enabled: !!program && !!publicKey,
    retry: false,
    queryFn: async () => {
      if (!program || !publicKey) return { ready: false, error: "No wallet" };

      const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from("user-profile"), new PublicKey(publicKey).toBuffer()],
        CONFIG.programId
      );

      let account: UserProfile | null = null;

      try {
        account = await program.account.userProfile.fetch(pda);
      } catch {
        throw new Error("User profile not found");
      }

      return { ready: true, account: account ?? undefined };
    },
  });
}