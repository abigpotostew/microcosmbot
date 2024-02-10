import type { SignerOptions } from '@cosmos-kit/core'
import { GasPrice, SigningCosmWasmClientOptions } from 'cosmwasm'
import { WalletProvider as WalletContextProvider } from './WalletContext'
// import StargazeProvider from "client/react/client/StargazeProvider";
import { ChainProvider } from '@cosmos-kit/react'
import { chains, assets } from 'chain-registry'
import { wallets as KeplrWallet } from '@cosmos-kit/keplr'
import { wallets as CosmostationWallet } from '@cosmos-kit/cosmostation'
import { wallets as LeapWallet } from '@cosmos-kit/leap'
import { wallets as OmniWallet } from '@cosmos-kit/omni'
import { getSigningCosmosClientOptions } from 'stargazejs'

const signerOptions: SignerOptions = {
  signingCosmwasm: ({
    chain_name,
  }): SigningCosmWasmClientOptions | undefined => {
    let gasTokenName: string | undefined
    switch (chain_name) {
      case 'stargaze':
      case 'stargazetestnet':
        gasTokenName = 'ustargaze'
        break
    }
    // @ts-ignore messed up dependencies
    return gasTokenName
      ? { gasPrice: GasPrice.fromString(`0.0025${gasTokenName}`) }
      : undefined
  },
  // @ts-ignore
  signingStargate: (_chain: Chain) => {
    return getSigningCosmosClientOptions()
  },
}

export default function WalletProvider({
  children,
}: {
  children: JSX.Element
}) {
  return (
    <ChainProvider
      signerOptions={signerOptions}
      chains={chains}
      assetLists={assets}
      // @ts-ignore
      wallets={[
        ...KeplrWallet,
        ...CosmostationWallet,
        ...OmniWallet,
        ...LeapWallet,
      ]}
      defaultNameService="stargaze"
      walletConnectOptions={{
        signClient: {
          projectId: '51e949ab2fe66ef257e6ac697377dc6d',
          metadata: {
            name: 'MicroCosmBot',
            description: 'Bot',
            icons: ['https://www.microcosmbot.xyz/icons/logo-larger.png'],
            url: 'https://www.microcosmbot.xyz',
          },
        },
      }}
    >
      <WalletContextProvider>
        <>{children}</>
        {/*<StargazeProvider>{children}</StargazeProvider>*/}
      </WalletContextProvider>
    </ChainProvider>
  )
}
