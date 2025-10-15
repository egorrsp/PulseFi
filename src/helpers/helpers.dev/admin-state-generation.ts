import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const network = "http://127.0.0.1:8899"

const Idl = JSON.parse(fs.readFileSync("staking/target/idl/staking.json", "utf-8"));

export async function setAdmin() {
  const connection = new Connection(network, "confirmed");

  const keypairPath = process.env.ADMIN_KEYPAIR_PATH;
  if (!keypairPath) throw new Error("❌ ADMIN_KEYPAIR_PATH is not defined in .env");

  console.log("🔑 Using admin keypair:", keypairPath);

  const secret = JSON.parse(fs.readFileSync(keypairPath, "utf-8"));
  const adminKeypair = Keypair.fromSecretKey(new Uint8Array(secret));

  const wallet = new Wallet(adminKeypair);
  const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
  const program = new Program(Idl, provider);

  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("admin-state")],
    program.programId
  );

  console.log("Admin PDA:", pda.toBase58());

  const airdropSig = await connection.requestAirdrop(adminKeypair.publicKey, 2 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(airdropSig, "confirmed");
  console.log("✅ Admin received airdrop:", airdropSig);

  const tx = await program.methods
    .programInitializeAdminState()
    .accounts({
      signer: adminKeypair.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([adminKeypair])
    .rpc();

  console.log("✅ Admin state initialized. Tx:", tx);
}

await setAdmin();