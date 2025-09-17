use anchor_lang::prelude::*;
pub use anchor_spl::token::Token;
pub use anchor_spl::token_interface::{Mint, TokenAccount};

use crate::state::{UserProfile, UserToken};

#[derive(Accounts)]
pub struct InitializeUserFirstLevel<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + UserProfile::INIT_SPACE,
        seeds = [b"user-profile", user.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeUserSecondLevel<'info> {
    #[account(
        mut,
        seeds = [b"user-profile", user.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,

    #[account(
        init,
        payer = user,
        space = 8 + UserToken::INIT_SPACE,
        seeds = [b"user-token", user.key().as_ref(), token_mint.key().as_ref()],
        bump
    )]
    pub user_token: Account<'info, UserToken>,

    /// интерфейсный минт
    pub token_mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = token_mint,
        associated_token::authority = user_token
    )]
    pub ata: InterfaceAccount<'info, TokenAccount>,

    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct TransferTokens<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,                       // автор транзакции
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,         // минт токена
    #[account(mut)]
    pub sender_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"user-token", signer.key().as_ref(), mint.key().as_ref()],
        bump
    )]
    pub user_token: Account<'info, UserToken>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user_token.key()
    )]
    pub recipient_token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}