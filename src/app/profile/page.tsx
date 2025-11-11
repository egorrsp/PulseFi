'use client'

import { checkAuthentication } from "@/helpers/server_api/auth";
import { getUserInfo, updateUsername } from "@/helpers/server_api/user_info";
import { useUserStore } from "@/helpers/store/useUserStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [inChange, setInChange] = useState(false);
    const [usernameInput, setUsernameInput] = useState("");

    const {
        publicKey,
        username,
        rewards,
        createdAt,
        lastSeen,
        banned,
        banReason,
        updateUser,
    } = useUserStore();

    const refreshUserInfo = async () => {
        if (publicKey && (!createdAt || !lastSeen)) {
            try {
                const response = await getUserInfo(publicKey);
                updateUser({
                    username: response.username,
                    rewards: response.rewards,
                    createdAt: response.created_at,
                    lastSeen: response.last_seen,
                    banned: response.banned,
                    banReason: response.ban_reason,
                });
            } catch (err) {
                console.error("Error retrieving user:", err);
            }
        }
    };

    const handleUpdateUsername = async () => {
        if (!usernameInput || !publicKey) return;
        try {
            await updateUsername(publicKey, usernameInput);
            updateUser({ username: usernameInput });
            setInChange(false);
        } catch (err) {
            console.error("Error updating username:", err);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const autoVerify = async () => {
            setIsLoading(true);
            try {
                const response = await checkAuthentication();
                if (isMounted && response.data.status === "protected") {
                    setIsLoading(false);
                }
            } catch {
                if (isMounted) {
                    setIsLoading(false);
                    router.push("/stake");
                }
            }
        };
        autoVerify();
        return () => {
            isMounted = false;
        };
    }, [router]);

    useEffect(() => {
        if (publicKey) refreshUserInfo();
    }, [publicKey]);

    if (isLoading) return <div>Verifying...</div>;

    return (
        <div className="w-full flex flex-col gap-20">
            {!inChange ? (
                <div className="flex flex-row items-center gap-5">
                    <h4 className="text-6xl font-sans font-semibold text-[#111827]">
                        {username ? username : "Anonymous"}
                    </h4>
                    <div
                        className="p-2 rounded-md hover:bg-blue-200 duration-150 cursor-pointer"
                        onClick={() => setInChange(true)}
                    >
                        <img
                            src="/pen-square-svgrepo-com.svg"
                            className="w-10"
                            alt="update"
                        />
                    </div>
                </div>
            ) : (
                <div className="flex flex-row items-center gap-5">
                    <input
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="border-[#2563EB] px-3 py-2 rounded-md border-2 lg:text-4xl sm:text-2xl text-xl font-sans font-semibold outline-none"
                        placeholder="New username"
                    />
                    <div className="flex flex-row">
                        <img
                            src="/profile/checked-ok-mark-accept-check-approved-svgrepo-com.svg"
                            className="md:w-16 w-12 cursor-pointer"
                            alt="confirm"
                            onClick={handleUpdateUsername}
                        />
                        <img
                            src="/profile/basic-denied-reject-svgrepo-com.svg"
                            className="md:w-16 w-12 cursor-pointer"
                            alt="cancel"
                            onClick={() => setInChange(false)}
                        />
                    </div>
                </div>
            )}

            <div>
                <div className="flex flex-row text-2xl gap-3">
                    <p>Your profile created at</p>
                    <p>{createdAt}</p>
                </div>
                <div className="flex flex-row text-2xl gap-3">
                    <p>Last seen at</p>
                    <p>{lastSeen}</p>
                </div>
                <div className="flex flex-row text-2xl gap-3">
                    <p>Total rewards earned:</p>
                    <p>{rewards}</p>
                </div>
            </div>
        </div>
    );
}