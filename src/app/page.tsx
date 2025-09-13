'use client'

import { useState } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

export default function Home() {
  const [amount, setAmount] = useState<number>(100)

  return (
    <div className="w-full min-h-screen flex flex-col gap-26 mt-20">
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

      <div className="w-full p-10 bg-gray-200 flex flex-row gap-6 rounded-lg">
        <div className="flex flex-col gap-3 w-1/2">
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

        <div className='w-1/2 flex flex-col gap-3'>
            <button className='bg-[#2563EB] text-white text-xl font-medium rounded-lg px-3 py-1 hover:bg-blue-700 duration-150 cursor-pointer'> Stake Now </button>
            <button className='bg-[#22C55E] text-white text-xl font-medium rounded-lg px-3 py-1 hover:opacity-80 duration-150 cursor-pointer'> Institutions </button>
        </div>
      </div>

        <div className='w-full flex flex-row justify-between items-center gap-32'>
            <div className='flex flex-row justify-start items-center gap-10'>
                <img src="/sol-logo.png" alt="Solana Logo" width={150} height={150} className='rounded-full' />
                <div className='flex flex-col items-end'>
                    <p className='font-sans text-2xl font-semibold'>6.7 %</p>
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
    </div>
  )
}