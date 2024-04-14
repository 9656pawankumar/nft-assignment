import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';
import { useToast } from "./components/ui/use-toast"

import { Button } from "./components/ui/button"

export function Account() {
    const { address, connector } = useAccount();
    const { disconnect } = useDisconnect();
    const { data: ensName } = useEnsName({ address });
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
    const { toast } = useToast();

    const formattedAddress = formatAddress(address);

    return (
        <div className="row">
            <div className="inline">
                {ensAvatar ? (
                    <img alt="ENS Avatar" className="avatar" src={ensAvatar} />
                ) : (
                    <div className="avatar" />
                )}
                <div className="stack">
                    {address && (
                        <div className="text">
                            {ensName ? `${ensName} (${formattedAddress})` : formattedAddress}
                        </div>
                    )}
                    <div className="subtext">
                        Connected to {connector?.name} Connector
                    </div>
                </div>
            </div>
            <Button variant="destructive" onClick={() => {
                disconnect();

                toast({
                    title: `Disconnected from wallet`,
                    description: "",
                })

            }}>
                Disconnect wallet
            </Button>
        </div>
    );
}

function formatAddress(address?: string) {
    if (!address) return null;
    return `${address.slice(0, 6)}…${address.slice(38, 42)}`;
}
