import { http, createConfig } from 'wagmi'
import { base, mainnet, optimism,sepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'


export const config = createConfig({
  chains: [mainnet, base,sepolia],
  connectors: [
    injected(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
})