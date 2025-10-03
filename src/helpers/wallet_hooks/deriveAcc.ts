'use client'

import { PublicKey } from "@solana/web3.js";
import { useUserStore } from "../store/useUserStore";
import { CONFIG } from "@/config";

export function findUserProfile() {
    const { publicKey, program } = useUserStore.getState();

    if (!publicKey || !program) {
        throw Error("Can't find publicKey or program");
    }

    const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from("user-profile"), new PublicKey(publicKey).toBuffer()],
        CONFIG.programId
    );

    return pda;
}

export function findTokenProfile(mint: PublicKey) {
    const { publicKey, program } = useUserStore.getState();

    if (!publicKey || !program) {
        throw Error("Can't find publicKey or program");
    }

    const [pda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("user-token"),
            new PublicKey(publicKey).toBuffer(),
            mint.toBuffer(),
        ],
        CONFIG.programId
    );

    return pda;
}