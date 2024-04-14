import { useState } from 'react'
import DeployContract from "../../deployContract";
import { Input } from "../ui/input"

export default function() {
    const [nftName, setNftName] = useState<string>('');
    const [nftSymbol, setNftSymbol] = useState<string>('');


    return (

        <section className="min-h-screen bg-stone-900 text-white content-center">
            {/*<ConnectWallet />*/}
            <div className="mx-auto max-w-96 min-h-96">
                Deploy a contract
                <Input className="mt-5 max-w-96" type="text" placeholder="NFT Collection Name" value={nftName} onChange={(e) => setNftName(e.target.value)} />
                <Input className="mt-5 max-w-96" type="text" placeholder="NFT Symbol" value={nftSymbol} onChange={(e) => setNftSymbol(e.target.value)} />
                <DeployContract
                    contractArg1={nftName}
                    contractArg2={nftSymbol}
                    className="mt-3"
                />
            </div>
        </section>
    )
}
