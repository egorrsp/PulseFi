use anchor_lang::prelude::*;
use anchor_spl::token::{Mint};

use crate::state::{UserProfile, UserToken};

#[derive(Accounts)]
pub struct InitializeUzerFirstLevel<'info> {
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
pub struct InitializeUzerSecondLevel<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + UserToken::INIT_SPACE,
        seeds = [b"user-token", user.key().as_ref(), token_mint.key().as_ref()],
        bump
    )]
    pub user_token: Account<'info, UserToken>,

    #[account(mut)]
    pub token_mint: Account<'info, Mint>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}