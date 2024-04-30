// SPDX-License-Identifier: GPL-3.0-or-later

import '@microcosmbot/ui/styles.css'
import 'styles/globals.css'

import { RecoilRoot } from 'recoil'
import type { AppProps, AppType } from 'next/app'
import { Amatic_SC, Lexend_Deca, Patrick_Hand } from '@next/font/google'
import LayoutWrapper from 'components/LayoutWrapper'
import classNames from 'classnames'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as Fathom from 'fathom-client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from 'utils/trpc'
import dynamic from 'next/dynamic'

const WalletProviderRoot = dynamic(
  () => import('../client/react/wallet/WalletProviderRoot')
  // {
  //   loading: () => <p>Loading...</p>,
  // }
)

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

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <WalletProviderRoot>
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
        </WalletProviderRoot>
        {/*</ChainProvider>*/}
      </QueryClientProvider>
    </>
  )
}
export default trpc.withTRPC(MyApp)
