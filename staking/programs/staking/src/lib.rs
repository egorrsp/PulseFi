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
    /// 1
    pub fn program_stake_tokens(ctx: Context<InitializeUserSecondLevel>, amount: u64) -> Result<()> {
        instructions::stake_tokens(ctx, amount)
    }
    /// 2
    ///  Инструкции 1-2 связаны между собой
    /// Смысл чтобы они вызывались атомарно
    /// В 1 создаем UserToken и кидаем токен в общий пул
    /// В 2 уже сам перевод (более ответственная зона)
    /// ВСЕГДА ПАКУЙ В ОДНУ sig
    pub fn transfer_user_tokens(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
        instructions::transfer_tokens(ctx, amount)
    }

    /// Вывод токенов
    pub fn program_unstake_tokens(ctx: Context<UnstakeTokens>, amount: u64) -> Result<()> {
        instructions::unstake_tokens(ctx, amount)
    }

    pub fn program_initialize_admin_state(ctx: Context<InitializeAdmin>) -> Result<()> {
        instructions::initialize_admin_state(ctx)
    }

    pub fn program_change_admin_settings(
        ctx: Context<ChangeAdminSettings>, 
        reward_rate: Option<u64>, 
        max_tokens_per_user: Option<u8>, 
        paused: Option<bool>
    ) -> Result<()> {
        instructions::update_admin_state(ctx, reward_rate, max_tokens_per_user, paused)
    }
}