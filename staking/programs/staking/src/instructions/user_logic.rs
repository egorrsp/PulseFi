use crate::user_contexts::{InitializeUserFirstLevel, InitializeUserSecondLevel};
use anchor_lang::prelude::*;
use crate::errors::ErrorCode;

/// Предполагается, что эта инструкция вызывается один раз для каждого пользователя, чтобы создать его профиль.
/// В момент первого нажатия кнопки "Stake" на фронте (для его Pubkey()).
/// Инициализаци второго уровня происходит уже во время стейкинга конкретного токена.
pub fn initialize_user_first_level(ctx: Context<InitializeUserFirstLevel>) -> Result<()> {
    let user_profile = &mut ctx.accounts.user_profile;
    let user = &ctx.accounts.user;

    user_profile.user = user.key();
    user_profile.init_time = Clock::get()?.unix_timestamp as u64;
    user_profile.staked_tokens = Vec::new();
    Ok(())
}

pub fn stake_tokens(
    ctx: Context<InitializeUserSecondLevel>,
    amount: u64,
) -> Result<()> {
    let user_token = &mut ctx.accounts.user_token;
    let user_profile = &mut ctx.accounts.user_profile;

    // Обновили профиль
    if user_profile.staked_tokens.len() < 10 && !user_profile.staked_tokens.contains(&ctx.accounts.token_mint.key()) {
        // Добавляем токен в список, если его там ещё нет и если не превышен лимит
        user_profile.staked_tokens.push(ctx.accounts.token_mint.key());
    } else {
        return Err(ErrorCode::MaxStakedTokensReached.into());
    }
    
    // Обновили токен
    user_token.user = ctx.accounts.user.key();
    user_token.token_mint = ctx.accounts.token_mint.key();
    user_token.staked_amount = user_token.staked_amount.checked_add(amount)
        .ok_or(ErrorCode::Overflow)?;
    user_token.reward_debt = 0;
    user_token.last_reward_time = Clock::get()?.unix_timestamp as u64;
    user_token.ata = ctx.accounts.ata.key();

    Ok(())
}