import { http, createConfig } from 'wagmi'
import { base, mainnet, optimism,sepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    // safe({
    //     allowedDomains: [/app.safe.global$/],
    //     debug: false,
    // }),
    injected(),
    walletConnect({projectId:'4f1f810cbef4e6b668d7f74d86c77cc8'})
  ],
  transports: {
    // [mainnet.id]: http(),
    // [base.id]: http(),
    [sepolia.id]: http(),
  },
})