"use client"

import axios from "axios";
import React from "react";

const api_instans = process.env.NEXT_PUBLIC_SERVER;

export function LogoutUI() {

    const [error, setError] = React.useState<string | null>(null);

    const handleLogout = async () => {
        try {
            const response = await axios.get(`${api_instans}/logout`, { withCredentials: true });
            return response.data;
        } catch (err: any) {
            setError('Logout failed. Please try again.' + err.toString());
        }
    }

    return (
        <div className="flex sm:flex-row flex-col-reverse items-center justify-around gap-10 p-5 border-4 border-[#2563EB] rounded-md">
            <div className="flex flex-col items-center gap-5">
                <p>Click the button to logout</p>
                <button
                    onClick={() => handleLogout().then(() => console.log("logout"))}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                >
                    Logout
                </button>
            </div>
            <img src='/logout-svgrepo-com.svg' className="w-32 text-black" alt='logout' />
        </div>
    )

}