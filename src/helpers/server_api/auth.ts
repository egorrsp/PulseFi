"use client"

import axios from 'axios';
import bs58 from "bs58";

interface NonceResponse {
    data: {nonce: string}
}

const api_instans = process.env.NEXT_PUBLIC_SERVER;

async function getNonce(pubkey: string) {
  try {
    const response: NonceResponse = await axios.post(`${api_instans}/nonce`, { pubkey });
    return response.data.nonce;
  } catch (err) {
    throw err;
  }
}

export async function authenticateWithWallet() {
  const provider = window.solana;
  if (!provider?.isPhantom) throw new Error("Phantom wallet not found");

  const { publicKey } = await provider.connect();
  const nonce = await getNonce(publicKey.toBase58());

  const signedMessage = await provider.signMessage(new TextEncoder().encode(nonce), "utf8");

  const payload = {
    nonce,
    public_key: publicKey.toBase58(),
    signature: bs58.encode(signedMessage.signature),
  };

  const response = await axios.post(`${api_instans}/authentication`, payload, {
    withCredentials: true,
  });

  return response;
}

export async function checkAuthentication() {
  try {
    const data = await axios.get(`${api_instans}/protect/check`, { withCredentials: true });
    return data;
  } catch (err) {
    throw err;
  }
}