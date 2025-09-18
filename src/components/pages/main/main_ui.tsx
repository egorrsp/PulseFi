export const MainTop = () => {
    return(
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

export const ApyComponent = ({apy}: ApyProps) => {
    return(
        <div className='w-full flex flex-row justify-between items-center gap-32'>
          <div className='flex flex-row justify-start items-center gap-10'>
            <img src="/sol-logo.png" alt="Solana Logo" width={150} height={150} className='rounded-full' />
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