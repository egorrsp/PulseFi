import { PublicKey } from "@solana/web3.js";
import { CONFIG } from "../config";

export const PROGRAM_ID = new PublicKey(CONFIG.programId);

// === Accounts ===
export interface UserProfile {
  user: PublicKey;
  initTime: bigint;
  stakedTokens: PublicKey[];
}

export interface UserToken {
  user: PublicKey;
  token_mint: PublicKey;
  staked_amount: bigint;
  reward_debt: bigint;
  last_reward_time: bigint;
  ata: PublicKey;
}

// === Errors ===
export enum StakingErrors {
  MaxStakedTokensReached = 10,
  Overflow = 11,
}

// === Instructions ===
export interface ProgramInitializeUserFirstLevelAccounts {
  user_profile: PublicKey;
  user: PublicKey;
  system_program: PublicKey;
}

export interface ProgramStakeTokensAccounts {
  user_profile: PublicKey;
  user_token: PublicKey;
  token_mint: PublicKey;
  user: PublicKey;
  system_program: PublicKey;
  ata: PublicKey;
  associated_token_program: PublicKey;
  token_program: PublicKey;
  rent: PublicKey;
}

export interface TransferUserTokensAccounts {
  signer: PublicKey;
  mint: PublicKey;
  sender_token_account: PublicKey;
  user_token: PublicKey;
  recipient_token_account: PublicKey;
  token_program: PublicKey;
}

export interface ProgramStakeTokensArgs {
  amount: bigint;
}

export interface TransferUserTokensArgs {
  amount: bigint;
}