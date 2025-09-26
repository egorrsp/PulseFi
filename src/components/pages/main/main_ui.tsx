import { loadTokenList, TokenConfig } from "@/helpers/lists/token_list";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const MainTop = () => {
    return (
        <div className="flex sm:flex-row flex-col justify-between items-center gap-16">
            <div>
                <h4 className="text-6xl font-sans font-semibold text-[#111827]">
                    PulseFi
                </h4>
                <p className='text-[#111827] text-md'>Secure. Transparent. Rewarding.</p>
            </div>
            <div className="flex flex-row justify-end items-center gap-5">
                <h2 className="text-2xl font-sans text-[#22C55E] max-w-2xl text-left sm:border-l-2 sm:border-t-0 border-t-2 border-[#22C55E] md:pl-16 sm:pl-8 pl-0 sm:pt-0 pt-8">
                    A decentralized Solana-based platform that lets you grow your tokens, earn competitive rewards, and stay in control of your funds at all times.
                </h2>
            </div>
        </div>
    )
}

type ApyProps = {
    apy: string;
};

export const ApyComponent = ({ apy }: ApyProps) => {
    return (
        <div className='w-full flex flex-row justify-between items-center gap-32'>
            <div className='flex flex-row justify-start items-center gap-10'>
                <img src="main/sol-logo.png" alt="Solana Logo" width={150} height={150} className='rounded-full' />
                <div className='flex flex-col items-end'>
                    <p className='font-sans text-2xl font-semibold'>{apy} %</p>
                    <p className='text-right text-xl'>Alleged APY</p>
                </div>
            </div>
            <div className='flex flex-row items-center justify-end h-[200px] py-5 px-10 w-full bg-[#E5E7EB] rounded-md'>
                <p className='font-sans text-lg text-[#111827]'>
                    Our platform uses <span className='font-medium text-[#2563EB]'>modern blockchain technology</span> to provide <span className='font-medium text-[#2563EB]'>reliable</span> and <span className='font-medium text-[#2563EB]'>transparent earnings</span>.
                    With innovative <span className='font-medium text-[#2563EB]'>staking mechanisms</span> powered by <span className='font-medium text-[#2563EB]'>Solana</span>, you can <span className='font-medium text-[#2563EB]'>maximize returns</span> while keeping <span className='font-medium text-[#2563EB]'>full control</span> over your assets.
                </p>
            </div>
        </div>
    )
}

export const SupportedTokens = () => {

    const [tokens, setTokens] = useState<TokenConfig[]>([]);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        let mounted = true;
        loadTokenList()
            .then(list => {
                if (!mounted) return;
                setTokens(list);
            })
            .catch((e) => {
                console.error("Failed to load token list", e);
                if (!mounted) return;
                setError("Failed to load tokens");
                setTokens([]);
            });
        return () => { mounted = false; };
    }, []);

    if (error) return <p>{error}</p>;
    if (tokens === null) return <p>Loading tokens...</p>;
    if (tokens.length === 0) return <p>No tokens available</p>;

    return (
        <div className="w-full flex flex-col gap-10 rounded-lg">
            <div>
                <h2 className="text-4xl font-sans text-[#2563EB]">Which tokens do we support?</h2>
                <p className="text-[#2563EB] text-lg">
                    We currently support a wide range of popular cryptocurrencies on Solana and beyond.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 grid-cols-1 gap-8">

                {tokens.map((token, index) => (
                    <div 
                        className="w-full sm:h-40 h-20 border border-gray-300 hover:bg-[#2563EB] duration-300 hover:text-white px-5 py-3 flex flex-row items-center justify-center gap-5 rounded-lg group cursor-pointer" 
                        key={index}
                        onClick={() => router.push("/stake")}
                    >
                        <img src={token.logo} alt="" className="rounded-full sm:w-20 w-10 sm:h-20 h-10 group-hover:hidden duration-300"/>
                        <p className="text-xl group-hover:hidden duration-300">{token.name}</p>
                        <p className="hidden duration-300 group-hover:block text-white">Go to Stake page</p>
                    </div>
                ))}

            </div>

            <p className="font-sans text-2xl pt-5 italic">
                We support all major tokens and continuously expand our list — explore the full catalog in the
                <span className="text-[#2563EB] font-semibold"> Institutions</span> tab.
            </p>
        </div>
    )
}