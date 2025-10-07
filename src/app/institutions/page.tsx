export default function Page() {
    return (
        <div className="max-w-5xl mx-auto p-6 space-y-12">
            <h1 className="text-4xl text-[#2563EB] border-b-4 border-[#2563EB] inline-block pb-2">
                Institutions
            </h1>

            <p className="text-lg text-gray-700">
                Our partner institutions participate in the staking program on Solana/Anchor. Users can stake a variety of tokens — from <span className="text-[#2563EB]">SOL</span> to <span className="text-[#2563EB]">USDT</span> — and earn high yields with real-time market prices.
            </p>

            <div className="space-y-6">
                <h2 className="text-2xl text-[#2563EB]">How It Works</h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li><span className="">Institution Registration:</span> Verified institutions join the program to manage staking pools and provide services to users.</li>
                    <li><span className="">User Participation:</span> Users select an institution and stake their tokens securely via smart contracts.</li>
                    <li><span className="">Earnings & Rewards:</span> Users earn competitive yields, automatically calculated using current market prices.</li>
                    <li><span className="">Transparency & Security:</span> All staking operations are recorded on-chain, ensuring full transparency and safety.</li>
                </ol>
            </div>
            
            <div className="space-y-4">
                <h2 className="text-2xl text-[#2563EB]">Why Join</h2>
                <p className="text-gray-700">
                    Institutions gain tools to manage staking pools and attract users, while users enjoy <span className="text-[#2563EB]">flexible staking, real-time rates, and high returns</span>.
                </p>
            </div>
        </div>
    );
}