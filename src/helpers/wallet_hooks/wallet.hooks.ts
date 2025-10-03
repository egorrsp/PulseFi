'use client';

import * as anchor from "@coral-xyz/anchor";
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import Idl from "../../../staking/target/idl/staking.json"
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import { use, useMemo } from 'react';
import { useUserStore } from '../store/useUserStore';
import { UserProfile } from '@/types/programId';
import { CONFIG } from '@/config';
import { QueryClient } from "@tanstack/react-query";
import { findTokenProfile, findUserProfile } from './deriveAcc';
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";

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

export const createUserProfile = async (
    pda: PublicKey,
    program: any,
    publicKey: string,
    queryClient: QueryClient
): Promise<{ ready: boolean; account?: UserProfile; error?: string }> => {
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

        setTimeout(() => {
            queryClient.invalidateQueries({
                queryKey: ["userProfile", publicKey],
            });
        }, 2000);

        return { ready: true, account };
    } catch (err: any) {
        console.warn("Failed to initialize user profile:", err.message);
        return { ready: false, error: err.message };
    }
};

export async function makeTransaction(mint: PublicKey, amount: BigInt) {
    const { publicKey } = useUserStore.getState();
    const { connected } = useUserStore.getState();
    const { provider } = useUserStore.getState();
    const { program } = useUserStore.getState();

    if (!publicKey || !connected || !mint || !program) {
        throw new Error("No wallet connected")
    }

    const tx = new anchor.web3.Transaction();

    const tx1 = await program.methods
        .programStakeTokens(new BN(amount))
        .accounts({
            userProfile: findUserProfile(),
            userToken: findTokenProfile(mint),
            tokenMint: mint,
            user: publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
            ata: await getAssociatedTokenAddress(mint, new PublicKey(publicKey)),
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .instruction();

    tx.add(tx1);

    const tx2 = await program.methods
        .transferUserTokens(new BN(amount))
        .accounts({
            signer: publicKey,
            mint: mint,
            senderTokenAccount: await getAssociatedTokenAddress(mint, new PublicKey(publicKey)),
            userToken: findTokenProfile(mint),
            recipientTokenAccount: await getAssociatedTokenAddress(
                mint,
                findTokenProfile(mint),
                true
            ),
            tokenProgram: CONFIG.programId,
        })
        .instruction();

    tx.add(tx2);

    const signature = await provider.sendAndConfirm(tx);
    return signature;
}

export { findUserProfile };



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