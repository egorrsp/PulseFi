use anchor_lang::prelude::*;
 
 #[error_code]
pub enum ErrorCode {
    #[msg("Maximum number of staked tokens reached.")]
    MaxStakedTokensReached,

    #[msg("Overflow occurred during calculation.")]
    Overflow,
}