// SPDX-License-Identifier: GPL-3.0-or-later

import '@microcosmbot/ui/styles.css'
import 'styles/globals.css'

import { RecoilRoot } from 'recoil'
import type { AppProps, AppType } from 'next/app'
import { Lexend_Deca, Patrick_Hand, Amatic_SC } from '@next/font/google'
import LayoutWrapper from 'components/LayoutWrapper'
import classNames from 'classnames'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as Fathom from 'fathom-client'
import { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { ChainProvider } from '@cosmos-kit/react'
import { chains, assets } from 'chain-registry'
import { wallets as keplrWallets } from '@cosmos-kit/keplr'
import { SignerOptions } from '@cosmos-kit/core'
import { Chain } from '@chain-registry/types'
import { getSigningCosmosClientOptions } from 'stargazejs'
import { GasPrice } from '@cosmjs/stargate'
import { trpc } from 'utils/trpc'

const queryClient = new QueryClient()

const lex = Lexend_Deca({ subsets: ['latin'] })
const roboto = Patrick_Hand({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-roboto',
})
const londrina = Amatic_SC({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-londrina',
})

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()

  useEffect(() => {
    // Fathom.load('RYFJCHST', {
    //   includedDomains: ['www.nouns.stream'],
    // })

    function onRouteChangeComplete() {
      Fathom.trackPageview()
    }
    // Record a pageview when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    // Unassign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router.events])

  const signerOptions: SignerOptions = {
    // @ts-ignore
    signingStargate: (_chain: Chain) => {
      return getSigningCosmosClientOptions()
    },
    // @ts-ignore
    signingCosmwasm: (chain: Chain) => {
      switch (chain.chain_name) {
        case 'stargaze':
          return {
            gasPrice: GasPrice.fromString('0.0ustars'),
          }
      }
    },
  }

  // console.log(
  //   'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID',
  //   process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
  // )
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ChainProvider
          chains={chains}
          assetLists={assets}
          wallets={[
            ...keplrWallets,
            // ...cosmostationWallets,
            // ...leapWallets,
            // ...wcWallets,
          ]}
          walletConnectOptions={{
            signClient: {
              logger: 'debug',
              projectId: process.env
                .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
              relayUrl: 'wss://relay.walletconnect.com',
              metadata: {
                name: 'MicroCosmBot',
                description:
                  'MicroCosmbot creates token gated telegram groups.',
                url: 'https://www.microcosmbot.xyz',
                icons: ['https://www.microcosmbot.xyz/icons/logo-larger.png'],
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
      </QueryClientProvider>
    </>
  )
}
export default trpc.withTRPC(MyApp)
