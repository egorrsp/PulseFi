import { TokenListProvider, TokenInfo } from "@solana/spl-token-registry";
import { PublicKey } from "@solana/web3.js";

export interface TokenConfig {
    key: number;
    name: string;
    address: PublicKey;
    logo: string;
    decimals: number;
}

const WHITELIST = [
    "SOL",
    "USDC",
    "USDT", 
    "BONK", 
    "JUP", 
    "RAY", 
    "ORCA", 
    "SRM",
    "WIF", 
    "PRT", 
    "MNDE", 
    "SHDW", 
    "HNT", 
    "MOBILE", 
    "PYTH",
    "MAPS", 
    "FIDA", 
    "MER", 
    "SNY", 
    "C98",
];

export async function loadTokenList(): Promise<TokenConfig[]> {
    const provider = new TokenListProvider();
    const tokens = await provider.resolve();
    // 101 === ENV.MainnetBeta
    const tokenList = tokens.filterByChainId(101).getList();

    const filtered = tokenList.filter((t: TokenInfo) => WHITELIST.includes(t.symbol));

    return filtered.map((t: TokenInfo, idx: number) => ({
        key: idx,
        name: t.symbol,
        address: new PublicKey(t.address),
        logo: t.logoURI ?? "",
        decimals: t.decimals ?? 6,
    }));
}

export async function getTokenBySymbol(symbol: string): Promise<TokenConfig | null> {
    const tokens = await loadTokenList();
    const token = tokens.find((t) => t.name === symbol);
    return token ?? null;
}