import { useEffect } from 'react'
import { useAccount } from 'wagmi';

import { Account } from './Account';
import { Connect } from './Connect';
import StatusBanner from './components/my/StatusBanner';

export function ConnectWallet() {
    const { address, isConnecting, isConnected } = useAccount();

    return (
        <div className="">
            <StatusBanner className="" status={isConnected}/>
            <p className="text-white">Connect to a wallet</p>
            {isConnected ? <Account /> : <Connect status={isConnecting}/>}
        </div>
    );
}
