// SPDX-License-Identifier: GPL-3.0-or-later

import '@nouns-stream/ui/styles.css'
import 'styles/globals.css'

import { RecoilRoot } from 'recoil'
import type { AppProps, AppType } from 'next/app'
import { WagmiConfig, configureChains, createClient } from 'wagmi'
import { mainnet, goerli, arbitrum, optimism, polygon } from 'wagmi/chains'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import { Lexend_Deca, Roboto, Londrina_Solid } from '@next/font/google'
import LayoutWrapper from 'components/LayoutWrapper'
import classNames from 'classnames'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as Fathom from 'fathom-client'
import { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { ChainProvider } from '@cosmos-kit/react'
import { chains, assets } from 'chain-registry'
import { wallets as keplrWallets } from '@cosmos-kit/keplr'
import { wallets as cosmostationWallets } from '@cosmos-kit/cosmostation'
import { wallets as leapWallets } from '@cosmos-kit/leap'
import { SignerOptions } from '@cosmos-kit/core'
import { Chain } from '@chain-registry/types'
import { getSigningCosmosClientOptions } from 'stargazejs'
import { GasPrice } from '@cosmjs/stargate'
import { trpc } from 'utils/trpc'

const queryClient = new QueryClient()

const { provider } = configureChains(
  [mainnet, goerli],
  [
    infuraProvider({ apiKey: '51ec9cf9a1fc47c28fa7b4adadb4f8fc' }),
    alchemyProvider({ apiKey: 'jW1DpQDu64XyNpgD_AT3ez7UrnaUKzpv' }),
    publicProvider(),
  ]
)
const client = createClient(
  getDefaultClient({
    appName: 'Nouns Stream dApp',
    provider,
    chains: [goerli, mainnet, arbitrum, optimism, polygon],
  })
)

const lex = Lexend_Deca({ subsets: ['latin'] })
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
})
const londrina = Londrina_Solid({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-londrina',
})

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()

  useEffect(() => {
    Fathom.load('RYFJCHST', {
      includedDomains: ['www.nouns.stream'],
    })

    function onRouteChangeComplete() {
      Fathom.trackPageview()
    }
    // Record a pageview when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    // Unassign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [])
  const signerOptions: SignerOptions = {
    signingStargate: (_chain: Chain) => {
      return getSigningCosmosClientOptions()
    },
    signingCosmwasm: (chain: Chain) => {
      switch (chain.chain_name) {
        case 'stargaze':
          return {
            gasPrice: GasPrice.fromString('0.0ustars'),
          }
      }
    },
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig client={client}>
          <ConnectKitProvider theme="nouns">
            <ChainProvider
              chains={chains}
              assetLists={assets}
              wallets={[
                ...keplrWallets,
                // ...cosmostationWallets,
                // ...leapWallets,
              ]}
              walletConnectOptions={{
                signClient: {
                  projectId: process.env
                    .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
                  relayUrl: 'wss://relay.walletconnect.org',
                  metadata: {
                    name: 'MicroCosms Bot',
                    description:
                      'MicroCosms bot creates token gated telegram groups.',
                    url: 'https://microcosmsbot.tunnelmole.com',
                    icons: [],
                  },
                },
              }}
              wrappedWithChakra={false}
              signerOptions={signerOptions}
            >
              <RecoilRoot>
                <LayoutWrapper
                  className={classNames(
                    lex.className,
                    `${roboto.variable} font-sans`,
                    `${londrina.variable} font-serif`
                  )}
                >
                  <Component {...pageProps} />
                </LayoutWrapper>
              </RecoilRoot>
            </ChainProvider>
          </ConnectKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </>
  )
}
export default trpc.withTRPC(MyApp)
