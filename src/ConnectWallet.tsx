import { useAccount } from 'wagmi';
import React from 'react';

import { Account } from './Account';
import { Connect } from './Connect';

export function ConnectWallet() {
  const { isConnected } = useAccount();
  return (
    <div className="container">{isConnected ? <Account /> : <Connect />}</div>
  );
}