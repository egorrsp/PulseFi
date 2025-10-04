import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Staking } from "../target/types/staking";
import {
    createMint,
    getAssociatedTokenAddress,
    createAssociatedTokenAccount,
    mintTo,
} from "@solana/spl-token";
import { sendAndConfirmTransaction } from "@solana/web3.js";

describe("staking", () => {
    anchor.setProvider(anchor.AnchorProvider.env());
    const program = anchor.workspace.staking as Program<Staking>;

    const userId = anchor.web3.Keypair.generate();
    const adminId = anchor.web3.Keypair.generate();

    let mintPubkey: anchor.web3.PublicKey;
    let userTokenAccount: anchor.web3.PublicKey;
    let stakingPda: anchor.web3.PublicKey;
    let userProfilePda: anchor.web3.PublicKey;

    const airdrop = async (pubkey: anchor.web3.PublicKey) => {
        const sig = await program.provider.connection.requestAirdrop(
            pubkey,
            anchor.web3.LAMPORTS_PER_SOL * 2
        );
        await program.provider.connection.confirmTransaction(sig);
    };

    before(async () => {
        await airdrop(userId.publicKey);
        await airdrop(adminId.publicKey);

        const [adminPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("admin-state")],
            program.programId
        );

        const tx = await program.methods
            .programInitializeAdminState()
            .accounts({
                adminState: adminPda,
                signer: userId.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([userId])
            .rpc();

        console.log("Admin init tx:", tx);
    });

    it("Init user first-level acc", async () => {
        userProfilePda = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("user-profile"), userId.publicKey.toBuffer()],
            program.programId
        )[0];

        const tx = await program.methods
            .programInitializeUserFirstLevel()
            .accounts({
                userProfile: userProfilePda,
                user: userId.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([userId])
            .rpc();

        console.log("Init profile tx:", tx);
    });

    it("Stake tokens", async () => {
        mintPubkey = await createMint(
            program.provider.connection,
            userId,
            userId.publicKey,
            null,
            9
        );

        userTokenAccount = await createAssociatedTokenAccount(
            program.provider.connection,
            userId,
            mintPubkey,
            userId.publicKey
        );

        await mintTo(
            program.provider.connection,
            userId,
            mintPubkey,
            userTokenAccount,
            userId,
            1_000_000_000
        );

        stakingPda = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("user-token"), userId.publicKey.toBuffer(), mintPubkey.toBuffer()],
            program.programId
        )[0];

        userProfilePda = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("user-profile"), userId.publicKey.toBuffer()],
            program.programId
        )[0];

        const master_tx = new anchor.web3.Transaction();

        const tx1 = await program.methods
            .programStakeTokens(new anchor.BN(1000))
            .accounts({
                userProfile: userProfilePda,
                userToken: stakingPda,
                tokenMint: mintPubkey,
                user: userId.publicKey,
                userTokenAccount: userTokenAccount,
                tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .instruction();

        master_tx.add(tx1);

        const pdaAta = await getAssociatedTokenAddress(
            mintPubkey,
            stakingPda,
            true
        );

        const tx2 = await program.methods
            .transferUserTokens(new anchor.BN(1000))
            .accounts({
                signer: userId.publicKey,
                mint: mintPubkey,
                senderTokenAccount: userTokenAccount,
                userToken: stakingPda,
                recipientTokenAccount: pdaAta,
                tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            })
            .instruction();

        master_tx.add(tx2);

        const sig = await anchor.web3.sendAndConfirmTransaction(
            program.provider.connection,
            master_tx,
            [userId]
        );

        console.log("Stake transaction signature:", sig);
    });

    it("Unstake tokens", async () => {
        const pdaAta = await getAssociatedTokenAddress(
            mintPubkey,
            stakingPda,
            true
        );

        const master_tx = new anchor.web3.Transaction();

        const tx = await program.methods
            .programUnstakeTokens(new anchor.BN(500))
            .accounts({
                signer: userId.publicKey,
                mint: mintPubkey,
                recipientTokenAccount: userTokenAccount,
                userToken: stakingPda,
                senderTokenAccount: pdaAta,
                tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            })
            .instruction();

        master_tx.add(tx);

        const sig = await sendAndConfirmTransaction(
            program.provider.connection,
            master_tx,
            [userId]
        );

        console.log("Unstake 500 tokens:", sig);
    });
});