import * as React from 'react';
import { Connector, useChainId, useConnect, useAccount } from 'wagmi';
import { useToast } from "./components/ui/use-toast"

import { Button } from "./components/ui/button"

interface ConnectProps {
    status: boolean;
}

export function Connect({ status }: ConnectProps) {
    const chainId = useChainId();
    const { connectors, connect } = useConnect();
    const {address} = useAccount();

    const { toast } = useToast();

    return (
        <div className="flex gap-5">
            {connectors.map((connector) => {
                return (
                    <ConnectorButton
                        key={connector.uid}
                        connector={connector}
                        onClick={() => {
                            connect({ connector, chainId });

                            toast({
                                title: `Connected to wallet with address ${address}`,
                                variant: 'default',
                                className: 'text-white bg-green-600'
                            })
                        }}
                        status={status}
                    />
                )
            })}
        </div>
    );
}

function ConnectorButton({
    connector,
    onClick,
    status
}: {
    connector: Connector;
    onClick: () => void;
    status: boolean;
}) {
    const [ready, setReady] = React.useState(false);
    React.useEffect(() => {
        (async () => {
            const provider = await connector.getProvider();
            setReady(!!provider);
        })();
    }, [connector, setReady]);

    return (
        <Button className="text-black" variant="outline" disabled={!ready} onClick={onClick}>
            {status ? <Spinner /> : connector.name === 'Injected' ? 'Connect with browser injected wallet' : `Connect with ${connector.name}`}
        </Button>
    );
}

function Spinner() {
    return (
        <div
            className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status">
        </div>
    )
}
