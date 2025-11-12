'use client';

import * as anchor from "@coral-xyz/anchor"
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import Idl from "../../../staking/target/idl/staking.json"
import { Connection, PublicKey, SendTransactionError, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import { useMemo } from 'react';
import { useUserStore } from '../store/useUserStore';
import { UserProfile } from '@/types/programId';
import { QueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CONFIG } from "@/config";
import { ConfigurateTransaction } from "./help-transaction-hooks";
import { findTokenProfile } from "./deriveAcc";
import { SecondLevelPda } from "@/app/stake/unstake/confirm/page";


export function wallet_hooks() {
    const { publicKey, connected } = useWallet();
    const connection = new Connection(CONFIG.network, {
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




interface CreateUserProfileParams {
    pda: PublicKey;
    program: any;
    publicKey: string;
    queryClient: QueryClient;
    onAlert?: (alert: boolean) => void;
}

interface CreateUserProfileResult {
    ready: boolean;
    account?: UserProfile;
    error?: string;
}

export const createUserProfile = async ({
    pda,
    program,
    publicKey,
    queryClient,
    onAlert,
}: CreateUserProfileParams): Promise<CreateUserProfileResult> => {
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

        const account: UserProfile = await program.account.userProfile.fetch(pda);

        setTimeout(() => {
            queryClient.invalidateQueries({
                queryKey: ["userProfile", publicKey],
            });
        }, 2000);

        return { ready: true, account };
    } catch (err: any) {
        console.warn("Failed to initialize user profile:", err.message);

        if (err.message?.includes("Attempt to debit an account but found no record of a prior credit")) {
            onAlert?.(true);
        }

        return { ready: false, error: err.message };
    }
};



// Транзакция, она кастомная - тут определены как 
// последний блокхеш так и плательщик fee
export async function makeTransaction(
    mint: PublicKey,
    amount: BN,
    router: ReturnType<typeof useRouter>
) {
    const { publicKey } = useUserStore.getState();
    const { connected } = useUserStore.getState();
    const { provider } = useUserStore.getState();
    const { program } = useUserStore.getState();

    const connection = new Connection(CONFIG.network, {
        commitment: "confirmed",
    });

    if (!publicKey || !connected || !mint || !program) {
        console.log("No wallet conneted")
        throw new Error("No wallet connected")
    }

    const master_tx = await ConfigurateTransaction(
        publicKey,
        program,
        connection,
        mint,
        amount
    );

    try {
        const latestBlockhash = await connection.getLatestBlockhash();

        master_tx.recentBlockhash = latestBlockhash.blockhash;
        master_tx.feePayer = provider.wallet.publicKey;

        const signedTx = await provider.wallet.signTransaction(master_tx);
        const signature = await connection.sendRawTransaction(signedTx.serialize(), {
            skipPreflight: false,
            preflightCommitment: "confirmed",
        });

        await connection.confirmTransaction(signature, "confirmed");

        console.log("Sent transaction:", signature);
        router.push("/stake/result/ok-page");
        return;
    } catch (err: any) {
        console.error("Transaction failed:", err);

        if (err instanceof SendTransactionError) {
            try {
                const logs = await err.getLogs(connection);
                console.log("Simulation logs:", logs);

                const anchorError = anchor.AnchorError.parse(logs);
                if (anchorError) {
                    console.error("Anchor error:", anchorError.error);
                    console.error("Error message:", anchorError.message);

                    if (anchorError.error.errorCode.code === "InsufficientFunds") {
                        router.push("/stake/result/error-page/insufficient-funds");
                        return;
                    } else {
                        console.log(`Program error: ${anchorError.message}`);
                    }
                } else {
                    alert("Unknown error during transaction simulation");
                }

            } catch (parseErr) {
                console.error("Failed to parse logs:", parseErr);
            }
        } else {
            console.log("can't sent transiction")
        }

        router.push("/stake/result/error-page");
        return;
    }
}



export async function GetSecondLevelAccount(tokenAddress: string) {
    const { program, publicKey, connected } = useUserStore.getState();

    const mint = new PublicKey(tokenAddress);
    const connection = new Connection(CONFIG.network, { commitment: "confirmed" });

    if (!publicKey || !connected || !mint || !program) {
        throw new Error("Wallet not connected or program not ready");
    }

    const tokenPda = findTokenProfile(mint);

    try {
        const accountInfo = await connection.getAccountInfo(tokenPda);
        if (!accountInfo) throw new Error("Account not found");

        const coder = new anchor.BorshAccountsCoder(program.idl);
        const decoded = coder.decode<SecondLevelPda>("userToken", accountInfo.data);

        return decoded;
    } catch (err) {
        console.error("Ошибка при получении PDA:", err);
        throw err;
    }
}

export async function UnstakeTokens() {

}