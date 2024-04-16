import { useState } from 'react'
import DeployContract from "../../deployContract";
import { TextField } from '@material-ui/core';

export default function() {
    const [nftName, setNftName] = useState<string>('');
    const [nftSymbol, setNftSymbol] = useState<string>('');


    return (

        <section className="min-h-screen bg-stone-900 text-white content-center">
            {/*<ConnectWallet />*/}
            <div className="mx-auto max-w-96 min-h-96">
                Deploy a contract
                <TextField
  className="mt-5 max-w-96"
  type="text"
  label="NFT Collection Name"
  placeholder="NFT Collection Name"
  value={nftName}
  onChange={(e) => setNftName(e.target.value)}
  variant="outlined"
/>
<TextField
  className="mt-5 max-w-96"
  type="text"
  label="NFT Symbol"
  placeholder="NFT Symbol"
  value={nftSymbol}
  onChange={(e) => setNftSymbol(e.target.value)}
  variant="outlined"
/>
                <DeployContract
                    contractArg1={nftName}
                    contractArg2={nftSymbol}
                    className="mt-3"
                />
            </div>
        </section>
    )
}
