import { ConnectButton } from "@/helpers/wallet_hooks/connect.button";

export default function Page() {
    return (
        <>
            <p className="text-3xl mb-10">Work with your wallet</p>
            <ConnectButton />
        </>
    );
}