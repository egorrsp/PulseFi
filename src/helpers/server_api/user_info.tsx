'use client';


import axios from 'axios';
import { UserInfo } from "@/types/user";

const api_instans = process.env.NEXT_PUBLIC_SERVER;

export async function getUserInfo(pubkey: string) {
    try {
        const response = await axios.get(`${api_instans}/protect/user/${pubkey}`, { withCredentials: true });
        return response.data as UserInfo;
    } catch (err) {
        throw err;
    }
}

export async function createUser(pubkey: string) {
    try {
        const response = await axios.post(`${api_instans}/protect/user/register`, { public_key: pubkey }, { withCredentials: true });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export async function updateUsername(pubkey: string, newUsername: string) {
    try {
        const responce = await axios.patch(`${api_instans}/protect/user/update-username`, 
            { pubkey, newUsername }, 
            { withCredentials: true });
        
        return responce.data;
    } catch (err) {
        throw err;
    }
}