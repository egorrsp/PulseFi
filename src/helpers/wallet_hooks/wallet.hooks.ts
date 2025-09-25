'use client';

import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import Idl from "../../../staking/target/idl/staking.json"
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { use, useMemo } from 'react';
import { useUserStore } from '../store/useUserStore';
import { UserProfile } from '@/types/programId';
import { CONFIG } from '@/config';

export function wallet_hooks() {
    const { publicKey, connected } = useWallet();
    const connection = new Connection(CONFIG.network, "confirmed");
    const anchorWallet = useAnchorWallet();

    const programId = new PublicKey(Idl.address);
    const provider = anchorWallet ? new AnchorProvider(connection, anchorWallet, { commitment: "confirmed" }) : null;

    const program = useMemo(() => {
        if (!provider) return null;
        return new Program(Idl, provider);
    }, [provider])

    return (
        {
            publicKey,
            connected,
            programId,
            provider,
            program
        }
    )
}

export function user_profile_info() {
    const publicKey = useUserStore((s) => s.publicKey);
    const program = useUserStore((s) => s.program);
    const connected = useUserStore((s) => s.connected);

    if (!connected || !publicKey || !program) {
        throw new Error("No wallet connected");
    }

    const [pda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("user-profile"), new PublicKey(publicKey).toBuffer()],
        new PublicKey(program.programId)
    );

    return [pda, bump] as [PublicKey, number];
}

export function token_storage_info() {
    const publicKey = useUserStore((s) => s.publicKey);
    const program = useUserStore((s) => s.program);
    const connected = useUserStore((s) => s.connected);
    const mints = useUserStore((s) => s.mint);

    if (!connected || !publicKey || !program) {
        throw new Error("No wallet connected");
    }

    if (!mints || mints.length === 0) {
        throw new Error("No mints found");
    }

    const result: Array<[PublicKey, number]> = mints.map((mint) =>
        PublicKey.findProgramAddressSync(
            [Buffer.from("token-storage"), new PublicKey(publicKey).toBuffer(), new PublicKey(mint).toBuffer()],
            new PublicKey(program.programId)
        )
    );

    return result;
}

export const createUserProfile = async (
    pda: PublicKey,
    program: any,
    publicKey: string
) => {
    let account: UserProfile;

    if (!program || !publicKey) {
        return { ready: false, error: "Missing program or publicKey" };
    }

    try {
        await program.methods
            .programInitializeUserFirstLevel()
            .accounts({
                user_profile: pda,
                user: new PublicKey(publicKey),
                system_program: SystemProgram.programId,
            })
            .rpc();

        account = await program.account.userProfile.fetch(pda);
        console.log("done")
        return { ready: true, account };
    } catch (err: any) {
        console.warn("Failed to initialize user profile:", err.message);
        return { ready: false, error: err.message };
    }
};

export function findUserProfile() {
    const publicKey = useUserStore((s) => s.publicKey);
    const program = useUserStore((s) => s.program);

    if (!publicKey || !program) {
        throw Error("Can't find publicKey");
    }

    const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from("user-profile"), new PublicKey(publicKey).toBuffer()],
        CONFIG.programId
    );

    return pda;
}

export function findUserStorage(){
    const PublicKey = useUserStore((s) => s.publicKey);

}

export async function updateTokenRecordsInProfile() {
    
}

// dev only
export async function requestAirdropForLocalDev() {
    const connection = new Connection(CONFIG.network, "confirmed");

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