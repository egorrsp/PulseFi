use anchor_lang::prelude::*;

// PDA первого уровня для хранения общей информации о пользователе
#[account()]
#[derive(InitSpace)]
pub struct UserProfile {
    pub user: Pubkey, // Владелец профиля
    pub init_time: u64, // Время инициализации профиля
    #[max_len(10)]
    pub staked_tokens: Vec<Pubkey>, // Список токенов, которыми владеет пользователь
}

// PDA второго уровня для хранения информации о конкретном токене, которым владеет пользователь
#[account()]
#[derive(InitSpace)]
pub struct UserToken {
    pub user: Pubkey, // Владелец токена
    pub token_mint: Pubkey, // Mint токена
    pub staked_amount: u64, // Количество застейканных токенов
    pub reward_debt: i64, // Сколько наград уже выплачено
    pub last_reward_time: u64, // Время последнего обновления наград
    pub ata: Pubkey, // Ассоциированный токен аккаунт пользователя для этого токена (чтоб фронту попроще было)
}