import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useUserStore } from "../store/useUserStore";
import { CONFIG } from "@/config";

export async function requestAirdropForLocalDev() {
    const connection = new Connection(CONFIG.network, {
        commitment: "confirmed",
        confirmTransactionInitialTimeout: 60000
    });

    const { publicKey } = useUserStore.getState();

    if (!connection || !publicKey) {
        console.error("Connection is not established");
        return;
    }

    const airdropSig = await connection.requestAirdrop(
        new PublicKey(publicKey),
        2 * LAMPORTS_PER_SOL
    );

    await connection.confirmTransaction(airdropSig, "confirmed");

    console.log("Airdrop requested");

    const balance = await connection.getBalance(new PublicKey(publicKey));
    console.log("Balance:", balance / LAMPORTS_PER_SOL, "SOL");
}