import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Staking } from "../target/types/staking";
import {
    createMint,
    getAssociatedTokenAddress,
    createAssociatedTokenAccount,
    mintTo,
} from "@solana/spl-token";

describe("staking", () => {
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.staking as Program<Staking>;

    const userId = anchor.web3.Keypair.generate();

    const airdrop = async () => {
        const sig = await program.provider.connection.requestAirdrop(
            userId.publicKey,
            anchor.web3.LAMPORTS_PER_SOL * 2
        );
        await program.provider.connection.confirmTransaction(sig);
    };

    before(async () => {
        await airdrop();
    });

    it("Init user first-level acc", async () => {
        const [userProfilePda] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("user-profile"), userId.publicKey.toBuffer()],
            program.programId
        );

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
        const mintPubkey = await createMint(
            program.provider.connection,
            userId,
            userId.publicKey,
            null,
            9
        );

        const userTokenAccount = await createAssociatedTokenAccount(
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

        const [stakingPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("user-token"), userId.publicKey.toBuffer(), mintPubkey.toBuffer()],
            program.programId
        );

        const [userProfilePda] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("user-profile"), userId.publicKey.toBuffer()],
            program.programId
        );

        const tx = await program.methods
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
            .signers([userId])
            .rpc();

        console.log("Stake tx:", tx);
    });
});