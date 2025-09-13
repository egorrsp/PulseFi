use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
pub use instructions::*;
pub mod errors;

declare_id!("6RhWcSV1oJgZdzZZDDD7qiRu4zjaDKW6xJueHxnF2ghN");

#[program]
pub mod staking {
    use super::*;

    pub fn program_initialize_user_first_level(ctx: Context<InitializeUserFirstLevel>) -> Result<()> {
       instructions::initialize_user_first_level(ctx)
    }

    pub fn program_stake_tokens(ctx: Context<InitializeUserSecondLevel>, amount: u64) -> Result<()> {
        instructions::stake_tokens(ctx, amount)
    }
}
