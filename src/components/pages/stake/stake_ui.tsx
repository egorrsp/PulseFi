import { createUserProfile } from "@/helpers/wallet_hooks/wallet.hooks";
import { useRouter } from "next/navigation";
import { findUserProfile } from "@/helpers/wallet_hooks/deriveAcc"
import { useUserStore } from "@/helpers/store/useUserStore";
import { PublicKey } from "@solana/web3.js";
import { useQueryClient } from "@tanstack/react-query";

// Top info & wallet address
export function TopStakeInfo() {

    const publicKey = useUserStore((s) => s.publicKey);

    return (
        <div className="flex md:flex-row flex-col justify-between items-center gap-16">
            <div>
                <h4 className="text-6xl font-sans font-semibold text-[#111827]">
                    GM
                </h4>
                <p className='text-[#111827] text-md'>Here you can stake your tokens</p>
            </div>
            <div className="flex flex-col justify-end gap-2 border border-[#22C55E] px-5 py-7 rounded-md hover:shadow-md shadow-[#22C55E] easy-in-out duration-150">
                <div className="flex flex-row w-full justify-between items-center">
                    <p className="text-left text-2xl text-[#22C55E]">Your wallet</p>
                    <p className="text-2xl text-[#22C55E]">＄</p>
                </div>
                <div
                    className='font-sans relative group'
                >
                    <p
                        className='font-sans'
                    >
                        Wallet address:
                        {publicKey && (
                            <span
                                className='group-hover:bg-[#e2e2e2] p-1 rounded-md easy-in-out duration-100 cursor-pointer active:bg-[#eeeeee]'
                                onClick={() => { navigator.clipboard.writeText(publicKey) }}
                            >
                                {publicKey}
                            </span>
                        )}
                    </p>
                    <p className="absolute right-0 top-5 group-hover:opacity-100 opacity-0 text-[#afafaf] easy-in-out duration-100">copy to clipboard</p>
                </div>
            </div>
        </div>
    );
}

// Info about profile & tokens
interface WalletStakeInfoProps {
    registerDate?: string;
    tokens?: PublicKey[];
    err?: string;
}

export function WalletStakeInfo(props: WalletStakeInfoProps) {
    const { registerDate, tokens, err } = props;

    const allFieldsMissing = registerDate === undefined;
    const allFieldsPresent = Boolean(registerDate);

    return (
        <div className="flex flex-row justify-between items-center gap-5">
            <div className="flex flex-col justify-start gap-2 rounded-md">
                <p className="text-4xl text-[#2563EB]">Your investments</p>

                {allFieldsMissing ? (
                    <p className="text-2xl">You have no investments yet.</p>
                ) : allFieldsPresent ? (
                    <>
                        <div className="flex flex-row justify-start items-center gap-5">
                            <p className="text-2xl border-b-2 border-[#2563EB]">Registration date:</p>
                            <p className="text-2xl">{registerDate}</p>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-2">
                            <p className="text-2xl border-b-2 border-[#2563EB]">Tokens:</p>
                            {tokens && tokens.length > 0 ? (
                                tokens.map((element, idx) => (
                                    <p key={idx} className="mt-2 text-xl break-all">
                                        {element.toBase58()}
                                    </p>
                                ))
                            ) : (
                                <p className="text-2xl">No tokens staked yet</p>
                            )}
                        </div>
                    </>
                ) : err ? (
                    <p className="text-2xl text-red-500">{err}</p>
                ) : (
                    <p className="text-2xl text-red-500">Error, please reload</p>
                )}
            </div>
        </div>
    );
}

// Create pda-profile
export function CreateUserProfileUI() {

    const router = useRouter();

    const pda = findUserProfile();

    const program = useUserStore((s) => s.program);
    const publicKey = useUserStore((s) => s.publicKey);

    const query = useQueryClient();

    let isError = false;
    if (!pda) {
        isError = true;
    }

    return (
        <div className="flex flex-col gap-16">
            <div className="flex md:flex-row flex-col justify-between items-center gap-16">
                <div>
                    <h4 className="text-6xl font-sans font-semibold text-[#111827]">
                        GM
                    </h4>
                    <p className='text-[#111827] text-md'>Here you can stake your tokens</p>
                </div>
                <div className="flex flex-col justify-end gap-2 border border-red-500 px-5 py-7 rounded-md hover:shadow-md shadow-red-500 easy-in-out duration-150">
                    <div className="flex flex-row w-full justify-between items-center">
                        <p className="text-left text-2xl text-red-500">We can't find your address</p>
                        <p className="w-2" />
                    </div>
                    <p
                        className='font-sans mt-3 text-center'
                    >
                        Please create you profile account to continue!
                    </p>
                    <button
                        className="w-full py-2 px-3 border-2 text-[#22C55E] border-[#22C55E] rounded-md uppercase hover:bg-[#22C55E] duration-200 cursor-pointer hover:text-white shadow-md active:shadow-none"
                        onClick={() => {
                            if (!pda) {
                                return;
                            }
                            if (!pda || !program || !publicKey) return;
                            createUserProfile(pda, program, publicKey, query);
                        }}
                    >
                        Create
                    </button>
                    {isError && (<p className="text-red-500 text-center">A key element is lost</p>)}
                </div>
            </div>
            <div className="w-full flex flex-col gap-5">
                <p className="border-t border-gray-400" />
                <p className="text-gray-400 text-2xl">Annotation</p>
                <p className="font-sans text-gray-400">
                    If you have already created an account before, or if you think there has been an error, please go to the
                    <span className="text-[#2563EB] cursor-pointer" onClick={() => router.push('/institutions')}> Institutions </span>
                    page. However, please make sure that you have selected the correct wallet!
                </p>
            </div>
        </div>
    )
}


// Buttons
export function StakeButton() {

    const router = useRouter();

    return (
        <button
            className="w-full py-3 border-2 border-[#22C55E] text-center rounded-md uppercase hover:bg-[#22C55E] duration-200 cursor-pointer hover:text-white shadow-md active:shadow-none text-2xl"
            onClick={() => router.push('stake/choise')}
        >
            Stake
        </button>
    );
}

export function UnstakeButton() {
    return (
        <button className="w-full py-3 border-2 border-red-500 text-center rounded-md uppercase hover:bg-red-500 duration-200 cursor-pointer hover:text-white shadow-md active:shadow-none text-2xl">
            Unstake
        </button>
    );
}