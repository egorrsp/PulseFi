use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
pub use instructions::*;
pub mod errors;
pub mod helpers;

declare_id!("61GA5Ajf6MzwJNWZQscN1WffG1M8WuExyb3Mpg9M8xEn");

#[program]
pub mod staking {
    use super::*;

    pub fn program_initialize_user_first_level(ctx: Context<InitializeUserFirstLevel>) -> Result<()> {
       instructions::initialize_user_first_level(ctx)
    }

    pub fn program_stake_tokens(ctx: Context<InitializeUserSecondLevel>, amount: u64) -> Result<()> {
        instructions::stake_tokens(ctx, amount)
    }

    pub fn transfer_user_tokens(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
        instructions::transfer_tokens(ctx, amount)
    }
}