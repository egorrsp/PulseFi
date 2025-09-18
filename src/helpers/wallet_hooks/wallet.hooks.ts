'use client';

import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import Idl from "../../../staking/target/idl/staking.json"
import {Connection, PublicKey} from "@solana/web3.js";
import {AnchorProvider, Program} from '@coral-xyz/anchor';
import { use, useMemo } from 'react';
import { useUserStore } from '../store/useUserStore';

export function wallet_hooks() {
    const {publicKey, connected} = useWallet();
    const connection = new Connection("http://127.0.0.1:8899", "confirmed");
    const anchorWallet = useAnchorWallet();
    
    const programId = new PublicKey(Idl.address);
    const provider = anchorWallet ? new AnchorProvider(connection, anchorWallet, { commitment: "confirmed" }) : null;

    const program = useMemo(() => {
        if (!provider) return null;
        return new Program(Idl, provider);
    }, [provider])

    return(
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
    const wallet = useWallet();
    const publicKey = useUserStore((s) => s.publicKey);
    const program = useUserStore((s) => s.program);

    if (useUserStore((s) => s.connected) || !publicKey || !program) {
        throw new Error("No wallet connected");
    }

    const [pda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("user-profile"), new PublicKey(publicKey).toBuffer()],
        new PublicKey(program.programId)
    )

    return (pda as PublicKey, bump)
}

export function token_storage_info() {
    const wallet = useWallet();
    const publicKey = useUserStore((s) => s.publicKey);


}