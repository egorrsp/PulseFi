use anchor_lang::prelude::*;
pub use anchor_spl::token::TokenAccount;

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
    // Мутим профиль пользователя
    #[account(
        mut,
        seeds = [b"user-profile", user.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,

    // Создаём PDA'шку для конкретного токена
    #[account(
        init,
        payer = user,
        space = 8 + UserToken::INIT_SPACE,
        // Уникальность PDA'шки обеспечивается сочетанием user + token_mint
        seeds = [b"user-token", user.key().as_ref(), token_mint.key().as_ref()],
        bump
    )]
    pub user_token: Account<'info, UserToken>,

    #[account(mut)]
    /// CHECK Информация о токене, которым владеет пользователь
    pub token_mint: AccountInfo<'info>,

    // Владелец профиля
    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
    
    // Ассоциированный токен аккаунт пользователя для этого токена
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = token_mint,
        associated_token::authority = user
    )]
    pub ata: AccountInfo<'info>,

    // Сохраняем для init_if_needed
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,

    #[account(mut)]
    /// CHECK
    pub token_program: AccountInfo<'info>,

    pub rent: Sysvar<'info, Rent>,
}