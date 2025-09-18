interface StakeInfoProps {
    publicKey: any;
}

export function TopStakeInfo({ publicKey }: StakeInfoProps) {
    return (
        <div className="flex flex-row justify-between items-center gap-16">
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
                        <span 
                            className='group-hover:bg-[#e2e2e2] p-1 rounded-md easy-in-out duration-100 cursor-pointer active:bg-[#eeeeee]'
                            onClick={() => {navigator.clipboard.writeText(publicKey?.toBase58())}}
                        >
                            {publicKey}
                        </span>
                    </p>
                    <p className="absolute right-0 top-5 group-hover:opacity-100 opacity-0 text-[#afafaf] easy-in-out duration-100">copy to clipboard</p>
                </div>
            </div>
        </div>
    );
}

interface WalletStakeInfoProps {
    amountStaked?: number;
    awardsPaid?: number;
    lastPaymentDate?: string;
}

export function WalletStakeInfo(props: WalletStakeInfoProps) {
    const { amountStaked, awardsPaid, lastPaymentDate } = props;

    const allFieldsMissing =
        amountStaked === undefined &&
        awardsPaid === undefined &&
        lastPaymentDate === undefined;

    const allFieldsPresent =
        amountStaked !== undefined &&
        awardsPaid !== undefined &&
        lastPaymentDate !== undefined;

    return (
        <div className="flex flex-row justify-between items-center gap-5">
            <div className="flex flex-col justify-start gap-2 rounded-md">
                <p className="text-4xl text-[#2563EB]">Your investments</p>

                {allFieldsMissing ? (
                    <p className="text-2xl">You have no investments yet.</p>
                ) : allFieldsPresent ? (
                    <>
                        <div className="flex flex-row justify-start items-center gap-5">
                            <p className="text-2xl">Staked:</p>
                            <p className="text-2xl">{amountStaked} $</p>
                        </div>
                        <div className="flex flex-row justify-start items-center gap-5">
                            <p className="text-2xl">Awards paid:</p>
                            <p className="text-2xl">{awardsPaid} $</p>
                        </div>
                        <div className="flex flex-row justify-start items-center gap-5">
                            <p className="text-2xl">Last payment date:</p>
                            <p className="text-2xl">{lastPaymentDate}</p>
                        </div>
                    </>
                ) : (
                    <p className="text-2xl text-red-500">Error, please reload</p>
                )}
            </div>
        </div>
    );
}