use anchor_lang::prelude::*;
 
 #[error_code]
pub enum ErrorCode {
    #[msg("Maximum number of staked tokens reached.")]
    MaxStakedTokensReached,

    #[msg("Overflow occurred during calculation.")]
    Overflow,

    #[msg("The program is currently paused.")]
    ProgramPaused,

    #[msg("Insufficient funds in the sender's token account.")]
    InsufficientFunds,

    #[msg("The provided mint does not match the expected mint.")]
    InvalidMint,
}