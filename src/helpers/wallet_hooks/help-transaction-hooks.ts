'use client'


import * as anchor from "@coral-xyz/anchor"
import { 
    createAssociatedTokenAccountInstruction, 
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { findTokenProfile, findUserProfile } from "./deriveAcc";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";


export async function ConfigurateTransaction(
    publicKey: string,
    program: any,
    connection: any,
    mint: PublicKey,
    amount: BN
) {
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
            .programStakeTokens(amount)
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
        .transferUserTokens(amount)
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

    return master_tx;
}