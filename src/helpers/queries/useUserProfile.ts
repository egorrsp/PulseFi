import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../store/useUserStore";
import { PublicKey } from "@solana/web3.js";
import { CONFIG } from "../../config";
import { UserToken } from "@/types/programId";

export function useUserProfile() {
  const program = useUserStore((s) => s.program);
  const publicKey = useUserStore((s) => s.publicKey);

  return useQuery({
    queryKey: ["userProfile", publicKey],
    enabled: !!program && !!publicKey,
    queryFn: async () => {
      if (!program || !publicKey) throw new Error("No wallet connected");

      const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from("user-profile"), new PublicKey(publicKey).toBuffer()],
        CONFIG.programId
      );

      const account = await program.account.userProfile.fetch(pda);
      return account as UserToken | undefined;
    },
  });
}