use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
pub use instructions::*;

declare_id!("6RhWcSV1oJgZdzZZDDD7qiRu4zjaDKW6xJueHxnF2ghN");

#[program]
pub mod staking {
    use super::*;

    pub fn program_initialize_uzer_first_level(ctx: Context<InitializeUzerFirstLevel>) -> Result<()> {
       instructions::initialize_uzer_first_level(ctx)
    }

    pub fn program_initialize_uzer_second_level(ctx: Context<InitializeUzerSecondLevel>) -> Result<()> {
        instructions::initialize_uzer_second_level(ctx)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
