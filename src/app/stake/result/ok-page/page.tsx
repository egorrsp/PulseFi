'use client'

import { useRouter } from "next/navigation";

export default function Page() {

    const router = useRouter();

    return (
        <div 
            className="w-full flex flex-col gap-5 justify-center items-center mt-40 cursor-pointer"
            onClick = { () => {router.push("/stake")}}
        >
            <p className="text-2xl text-[#22C55E]">You have successfully sent the tokens!</p>
            <img src="/transfer/success-filled-svgrepo-com.svg" className="w-20" />
            <p>tap anywhere to go back</p>
        </div>
    )
}