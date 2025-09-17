use crate::{user_contexts::{InitializeUserFirstLevel, InitializeUserSecondLevel, TransferTokens}};
use anchor_lang::{accounts::signer, prelude::*};
use anchor_spl::token::TransferChecked;
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

/// Инициализация второго уровня происходит в момент стейкинга конкретного токена.
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


/// Перевод токенов (staking)
pub fn transfer_tokens(
    ctx: Context<TransferTokens>, 
    amount: u64
) -> Result<()> {
    let bump = ctx.bumps.user_token;

    let signer_key = ctx.accounts.signer.key();
    let mint_key = ctx.accounts.mint.key();

    let signer_seeds: &[&[u8]] = &[
        b"user-token",
        signer_key.as_ref(),
        mint_key.as_ref(),
        &[bump],
    ];
    let signer_seeds_array = [signer_seeds];

    let cpi_accounts = TransferChecked {
        from: ctx.accounts.sender_token_account.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.recipient_token_account.to_account_info(),
        authority: ctx.accounts.user_token.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
    ).with_signer(&signer_seeds_array);

    anchor_spl::token::transfer_checked(
        cpi_ctx, 
        amount, 
        ctx.accounts.mint.decimals,
    )?;

    Ok(())
}