import { PublicKey } from "@solana/web3.js";

export const CONFIG = {
  network: "http://127.0.0.1:8899",
  programId: new PublicKey("61GA5Ajf6MzwJNWZQscN1WffG1M8WuExyb3Mpg9M8xEn"),

  tokens: {
    SOL: new PublicKey("So11111111111111111111111111111111111111112"),
    BONK: new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
    LINK: new PublicKey("CWE8jTBrgkqxzVZ4rYuJ3mY5YtAq6hGL2qzJutoyEwaN"),
    RNDR: new PublicKey("11111111111111111111111111111111"), // valid dummy
    AAVE: new PublicKey("11111111111111111111111111111112"), // valid dummy
    UNI: new PublicKey("11111111111111111111111111111113"), // valid dummy
    PUDGY: new PublicKey("11111111111111111111111111111114"), // dummy (NFT collection нельзя задать одним mint)
    WLF: new PublicKey("WLFinEv6ypjkczcS83FZqFpgFZYwQXutRbxGe7oC16g"),
  },
};