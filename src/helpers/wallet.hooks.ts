'use client';

import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import Idl from "../../staking/target/idl/staking.json"
import {Connection, PublicKey} from "@solana/web3.js";
import {AnchorProvider, Program} from '@coral-xyz/anchor';
import { useMemo } from 'react';

export default function wallet_hooks() {
    const {publicKey, wallet, connected} = useWallet();
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
            wallet,
            connected,
            programId,
            provider,
            program
        }
    )
}