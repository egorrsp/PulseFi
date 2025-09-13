use crate::user_contexts::{InitializeUzerFirstLevel, InitializeUzerSecondLevel};
use anchor_lang::prelude::*;

pub fn initialize_uzer_first_level(ctx: Context<InitializeUzerFirstLevel>) -> Result<()> {
    let user_profile = &mut ctx.accounts.user_profile;
    let user = &ctx.accounts.user;

    user_profile.user = user.key();
    user_profile.init_time = Clock::get()?.unix_timestamp as u64;
    user_profile.staked_tokens = Vec::new();
    Ok(())
}

pub fn initialize_uzer_second_level(ctx: Context<InitializeUzerSecondLevel>) -> Result<()> {
    let user_token = &mut ctx.accounts.user_token;
    let user = &ctx.accounts.user;
    let mint = &ctx.accounts.token_mint;

    user_token.user = user.key();
    user_token.token_mint = mint.key();
    user_token.staked_amount = 0;
    user_token.reward_debt = 0;
    user_token.last_reward_time = Clock::get()?.unix_timestamp as u64;
    user_token.ata = [7; 32].into();

    Ok(())
}