'use client';

import * as anchor from "@coral-xyz/anchor";
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import Idl from "../../../staking/target/idl/staking.json"
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import { useMemo } from 'react';
import { useUserStore } from '../store/useUserStore';
import { UserProfile } from '@/types/programId';
import { QueryClient } from "@tanstack/react-query";
import { findTokenProfile, findUserProfile } from './deriveAcc';
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useRouter } from "next/navigation";
import { CONFIG } from "@/config";


export function wallet_hooks() {
    const { publicKey, connected } = useWallet();
    const connection = new Connection(CONFIG.network , {
        commitment: "confirmed",
    });

    const anchorWallet = useAnchorWallet();

    const provider = anchorWallet
        ? new AnchorProvider(connection, anchorWallet, { commitment: "confirmed" })
        : null;

    const programId = new PublicKey(Idl.address);

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

export async function makeTransaction(
    mint: PublicKey,
    amount: BigInt,
    router: ReturnType<typeof useRouter>
) {
    const { publicKey } = useUserStore.getState();
    const { connected } = useUserStore.getState();
    const { provider } = useUserStore.getState();
    const { program } = useUserStore.getState();

    const connection = new Connection(CONFIG.network , {
        commitment: "confirmed",
    });

    if (!publicKey || !connected || !mint || !program) {
        throw new Error("No wallet connected")
    }

    const master_tx = new anchor.web3.Transaction();

    const userAta = await getAssociatedTokenAddress(mint, new PublicKey(publicKey));
    const userAtaInfo = await connection.getAccountInfo(userAta);

    if (!userAtaInfo) {
        master_tx.add(
            createAssociatedTokenAccountInstruction(
                new PublicKey(publicKey),
                userAta,
                new PublicKey(publicKey),
                mint
            )
        )
    }

    const tokenPda = findTokenProfile(mint);
    const tokenPdaInfo = await connection.getAccountInfo(tokenPda);

    if (!tokenPdaInfo) {
        const tx1 = await program.methods
            .programStakeTokens(new BN(amount))
            .accounts({
                userProfile: findUserProfile(),
                userToken: findTokenProfile(mint),
                tokenMint: mint,
                user: publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .instruction();

        master_tx.add(tx1);
    }

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
            tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction();

    master_tx.add(tx2);

    let signature

    try {
        signature = await provider.sendAndConfirm(master_tx);
    } catch (err) {
        router.push("/stake/result/error-page")
    }

    router.push("/stake/result/ok-page")

    return signature;
}