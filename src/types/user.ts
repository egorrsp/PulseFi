export interface UserInfo {
    public_key: string;
    username?: string;
    rewards?: string[];
    created_at: string;
    last_seen: string;
    banned: boolean;
    ban_reason?: string;
}