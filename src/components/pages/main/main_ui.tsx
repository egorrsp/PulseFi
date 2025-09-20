export const MainTop = () => {
    return (
        <div className="flex flex-row justify-between items-center gap-16">
            <div>
                <h4 className="text-6xl font-sans font-semibold text-[#111827]">
                    PulseFi
                </h4>
                <p className='text-[#111827] text-md'>Secure. Transparent. Rewarding.</p>
            </div>
            <div className="flex flex-row justify-end items-center gap-5">
                <h2 className="text-2xl font-sans text-[#22C55E] max-w-2xl text-left border-l-2 border-[#22C55E] pl-16">
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
    return (
        <div className="w-full flex flex-col gap-10 rounded-lg">
            <div>
                <h2 className="text-4xl font-sans text-[#2563EB]">Which tokens do we support?</h2>
                <p className="text-[#2563EB] text-lg">
                    We currently support a wide range of popular cryptocurrencies on Solana and beyond.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <img src="/tokens/solana.png" className="w-12 h-12 rounded-full" />
                    <div>
                        <h3 className="text-xl font-semibold">Solana (SOL)</h3>
                        <p className="text-gray-600">
                            The high-performance blockchain powering scalable applications and DeFi on Solana.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <img src="/tokens/Bonk.png" className="w-12 h-12 rounded-full" />
                    <div>
                        <h3 className="text-xl font-semibold">Bonk (BONK)</h3>
                        <p className="text-gray-600">
                            The community-driven meme coin of Solana, adding fun and liquidity to the ecosystem.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <img src="/tokens/Chainlink.png" className="w-12 h-12 rounded-full" />
                    <div>
                        <h3 className="text-xl font-semibold">Chainlink (LINK)</h3>
                        <p className="text-gray-600">
                            A decentralized oracle network connecting smart contracts to real-world data.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <img src="/tokens/PudgyPenguins.png" className="w-12 h-12 rounded-full" />
                    <div>
                        <h3 className="text-xl font-semibold">Pudgy Penguins</h3>
                        <p className="text-gray-600">
                            A vibrant NFT collection with growing utility and community presence across Web3.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <img src="/tokens/Render.png" className="w-12 h-12 rounded-full" />
                    <div>
                        <h3 className="text-xl font-semibold">Render (RNDR)</h3>
                        <p className="text-gray-600">
                            A token powering decentralized GPU rendering and 3D content creation.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <img src="/tokens/Aave.png" className="w-12 h-12 rounded-full" />
                    <div>
                        <h3 className="text-xl font-semibold">Aave (AAVE)</h3>
                        <p className="text-gray-600">
                            A leading DeFi protocol for decentralized lending, borrowing, and liquidity markets.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <img src="/tokens/Uniswap.png" className="w-12 h-12 rounded-full" />
                    <div>
                        <h3 className="text-xl font-semibold">Uniswap (UNI)</h3>
                        <p className="text-gray-600">
                            The most popular decentralized exchange protocol enabling token swaps and liquidity pools.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <img src="/tokens/WorldLibertyFinancial.png" className="w-12 h-12 rounded-full" />
                    <div>
                        <h3 className="text-xl font-semibold">World Liberty Financial (WLF)</h3>
                        <p className="text-gray-600">
                            A new-generation financial token expanding access to global crypto markets.
                        </p>
                    </div>
                </div>
            </div>

            <p className="font-sans">
                We support all major tokens and continuously expand our list — explore the full catalog in the
                <span className="text-[#2563EB] font-semibold"> Institutions</span> tab.
            </p>
        </div>
    )
}