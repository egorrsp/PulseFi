import { LogoutUI } from "@/helpers/server_api/logout_ui";
import { ConnectButton } from "@/helpers/wallet_hooks/connect_button";

export default function Page() {
    return (
        <>
            <p className="text-3xl mb-10">Work with your wallet</p>
            <ConnectButton />

            <p className="text-3xl mt-20">Logout with cookie</p>
            <LogoutUI />
        </>
    );
}