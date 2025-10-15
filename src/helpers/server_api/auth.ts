"use client"

import axios from 'axios';
import bs58 from "bs58";

interface NonceResponse {
    data: {nonce: string}
}

async function getNonce() {
    try {
        const api_instans = process.env.NEXT_PUBLIC_SERVER;
        const response: NonceResponse = await axios.get(`${api_instans}/nonce`);
        return response.data.nonce;
    }
    catch (err) {
        throw err;
    }
}

export async function authenticateWithWallet() {
  const provider = window.solana;
  if (!provider?.isPhantom) throw new Error("Phantom wallet not found");

  const { publicKey } = await provider.connect();
  const nonce = await getNonce();

  const signedMessage = await provider.signMessage(new TextEncoder().encode(nonce), "utf8");

  const payload = {
    nonce,
    public_key: publicKey.toBase58(),
    signature: bs58.encode(signedMessage.signature),
  };

  const api_instans = process.env.NEXT_PUBLIC_SERVER;
  const response = await axios.post(`${api_instans}/authentification`, payload);

  console.log("Tokens:", response.data);
  return response.data;
}