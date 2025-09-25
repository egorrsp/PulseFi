import { CONFIG } from "@/config";
import { PublicKey } from "@solana/web3.js";

interface TokenInfo {
    key: number;
    name: string;
    address: PublicKey;
    logo: string;
    decimals: number;
}

export const TOKEN_LIST: TokenInfo[] = [
    {
        key: 0,
        name: ("SOL").toString(),
        address: CONFIG.tokens.SOL,
        logo: "/tokens/solana.png",
        decimals: 9,
    },
    {
        key: 1,
        name: ("BONK").toString(),
        address: CONFIG.tokens.BONK,
        logo: "/tokens/Bonk.png",
        decimals: 9,
    },
    {
        key: 2,
        name: ("LINK").toString(),
        address: CONFIG.tokens.LINK,
        logo: "/tokens/Chainlink.png",
        decimals: 9,
    },
    {
        key: 3,
        name: ("RNDR").toString(),
        address: CONFIG.tokens.RNDR,
        logo: "/tokens/Render.png",
        decimals: 9,
    },
    {
        key: 4,
        name: ("AAVE").toString(),
        address: CONFIG.tokens.AAVE,
        logo: "/tokens/Aave.png",
        decimals: 9,
    },
    {
        key: 5,
        name: ("UNI").toString(),
        address: CONFIG.tokens.UNI,
        logo: "/tokens/Uniswap.png",
        decimals: 9,
    },
    {
        key: 6,
        name: ("PUDGY").toString(),
        address: CONFIG.tokens.PUDGY,
        logo: "/tokens/PudgyPenguins.png",
        decimals: 9,
    },
    {
        key: 7,
        name: ("WLF").toString(),
        address: CONFIG.tokens.WLF,
        logo: "/tokens/WorldLibertyFinancial.png",
        decimals: 9,
    }
];