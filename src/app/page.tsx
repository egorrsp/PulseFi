'use client'

import { useEffect, useState } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { ApyComponent, MainTop, SupportedTokens } from "../components/pages/main/main_ui"
import { useRouter } from 'next/navigation'

export default function Home() {

    const [amount, setAmount] = useState<number>(100);
    const router = useRouter();

    const APY: string = "6.7";

    useEffect(() => {
        localStorage.setItem('stakeAmount', amount.toString());
    }, [amount]);

    return (
        <div className="w-full min-h-screen flex flex-col gap-26">

            <MainTop />

            <div className="w-full md:p-10 p-5 bg-gray-200 flex sm:flex-row flex-col gap-6 rounded-lg">
                <div className="flex flex-col gap-3 sm:w-1/2">
                    <h1 className="font-sans text-[#111827] text-md">Amount to stake</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-medium text-[#2563EB]">${amount}</span>
                    </div>
                    <Slider
                        min={0}
                        max={1000}
                        step={10}
                        value={amount}
                        onChange={(value) => setAmount(value as number)}
                        trackStyle={{ backgroundColor: '#22C55E', height: 8 }}
                        handleStyle={{
                            borderColor: '#22C55E',
                            height: 24,
                            width: 24,
                            marginTop: -8,
                            backgroundColor: '#fff',
                        }}
                        railStyle={{ backgroundColor: '#D1D5DB', height: 8 }}
                    />
                </div>

                <div className='sm:w-1/2 flex flex-col gap-3'>
                    <button
                        className='bg-[#2563EB] text-white text-xl font-medium rounded-lg px-3 py-1 hover:bg-blue-700 duration-150 cursor-pointer'
                        onClick={() => router.push('/stake')}
                    >
                        Stake Now
                    </button>
                    <button
                        className='bg-[#22C55E] text-white text-xl font-medium rounded-lg px-3 py-1 hover:opacity-80 duration-150 cursor-pointer'
                        onClick={() => router.push('/institutions')}
                    >
                        Institutions
                    </button>
                </div>
            </div>

            <ApyComponent
                apy={APY}
            />

            <SupportedTokens />

            <p className='h-[300px]' />
        </div>
    )
}