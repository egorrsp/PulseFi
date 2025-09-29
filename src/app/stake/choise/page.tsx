'use client';

import { TokenSelector } from "@/components/pages/transfer/transfer_ui";
import { useRouter } from "next/navigation";


export default function Page() {
    
    const router = useRouter();

    return (
        <>
            <p className="text-2xl pb-10">Please select the token you would like to stake.</p>
            <TokenSelector onSelect={(token) => router.push(`/stake/transfer?token=${token.name}`)} />
            <p className="mb-10" />
        </>
    );
}