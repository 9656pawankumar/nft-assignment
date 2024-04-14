import { Button } from "../ui/button"
import { useDisconnect, useChainId, useConnect, Connector, useAccount } from "wagmi"

interface StatusBannerProps {
    className?: string;
    status: boolean;
}

export default function({ className, status }: StatusBannerProps) {
    const chainId = useChainId();
    const { isConnected } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    return (
        <div className={`fixed flex flex-col top-5 left-5 p-3 rounded text-xs opacity-65 transition hover:opacity-100 ${status ? "bg-green-600" : "bg-stone-700"} ${className}`}>
            <span>Connected to wallet: {status ? "Connected" : "Disconnected"}</span>
            {isConnected ? <button className="p-1 mt-2 rounded-md bg-stone-700" onClick={() => disconnect()}>Disconnect</button> : null}

            { !isConnected ? 
                connectors.map((connector) => {
                    return (
                        <button
                            key={connector.id}
                            className="p-1 mt-2 rounded-md bg-stone-800 hover:bg-stone-900"
                            onClick={() => connect({ connector, chainId })}>
                            {status ? <Spinner /> : connector.name === 'Injected' ? 'Connect with injected wallet' : `Connect with ${connector.name}`}
                        </button>
                    )
                })
             : null}


        </div>
    )
}

function Spinner() {
    return (
        <div
            className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status">
        </div>
    )
}
