'use client'

import { useRouter } from "next/navigation";

export default function Page() {

    const router = useRouter();

    return (
        <div 
            className="w-full flex flex-col gap-5 justify-center items-center mt-40 cursor-pointer"
            onClick = { () => {router.push("/stake")}}
        >
            <p className="text-2xl text-red-500">You don't have enough funds in your account!</p>
            <img src="/profile/basic-denied-reject-svgrepo-com.svg" className="w-20" />
            <p>tap anywhere to go back</p>
        </div>
    )
}