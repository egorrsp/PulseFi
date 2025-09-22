'use client';

import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import Idl from "../../../staking/target/idl/staking.json"
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { useMemo } from 'react';
import { useUserStore } from '../store/useUserStore';
import { UserProfile } from '@/types/programId';

export function wallet_hooks() {
    const { publicKey, connected } = useWallet();
    const connection = new Connection("http://127.0.0.1:8899", "confirmed");
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

export const calcUserProfile = async (pda: PublicKey) => {
    
    const program = useUserStore((s) => s.program);
    const publicKey = useUserStore((s) => s.publicKey);

    let account: UserProfile

    if (!program || !publicKey) {
        return ("Missing program").toString();
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
    } catch (err: any) {
        console.warn("Failed to initialize user profile:", err.message);
        return { ready: false, error: err.message };
    }
}