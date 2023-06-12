// SPDX-License-Identifier: GPL-3.0-or-later

import Header from './Header'
import Footer from './Footer'
import classNames from 'classnames'
import { Modal } from './Modal'
import { useRecoilState } from 'recoil'
import { modalState as modalInitState } from 'state/Modal'
import { mobileMenuState as mobileMenuInitState } from 'state/MobileMenu'
import Toaster from './Toaster'
import MobileMenu from './MobileMenu'
import { useNetwork } from 'wagmi'
import { Token, tokenListState } from 'state/TokenList'
import { useEffect } from 'react'
import { tokenListUrls } from 'constants/tokenListUrls'

interface LayoutWrapperProps {
  children: React.ReactNode
  className: string
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
  children,
  className,
}) => {
  const [mobileMenuState, setMobileMenuState] =
    useRecoilState(mobileMenuInitState)
  const [modalState, setModalState] = useRecoilState(modalInitState)
  const fixedWrapperClassList = 'overflow-hidden max-h-screen'
  const [tokensList, setTokensList] = useRecoilState(tokenListState)
  const { chain } = useNetwork()

  useEffect(() => {
    if (!chain) {
      return
    }

    fetchTokenListBasedOnNetwork(chain.network)
  }, [chain]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTokenListBasedOnNetwork = async (network: string) => {
    let blockedTokensResult: any

    if (network === 'goerli') {
      return
    }

    try {
      blockedTokensResult = await fetch(tokenListUrls.blockedTokens).then(
        (data) => data.json()
      )
    } catch {
      blockedTokensResult = await require(`pages/api/tokens/blockedTokens.json`)
    }

    let result: any

    try {
      result = await fetch(tokenListUrls[network]).then((data) => data.json())
    } catch {
      result = await require(`pages/api/tokens/${network}.json`)
    }

    const tokensList = (result.tokens || result)?.filter(
      (token: any) =>
        (token.chainId as number) === chain?.id &&
        !blockedTokensResult?.tokens?.some(
          (blockedToken: any) =>
            blockedToken.chainId === token.chainId &&
            blockedToken.symbol === token.symbol
        )
    )

    setTokensList((prev) => {
      return {
        ...prev,
        [network]: tokensList.map((token: any) => {
          return {
            chainId: token.chainId as number,
            address:
              (token.address as string) || (token.tokenAddress as string),
            name: token.name as string,
            symbol: token.symbol as string,
            logoUri:
              network === 'homestead' || network === 'mainnet'
                ? `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${token.address}/logo.png`
                : (token.logoURI as string),
            decimals: token.decimals,
          } as Token
        }),
      }
    })
  }

  const onModalClose = () =>
    setModalState((prev) => {
      return { ...prev, isModalOpen: false }
    })

  return (
    <div
      className={classNames(
        'flex flex-col w-full min-h-screen',
        className ?? '',
        mobileMenuState.mobileMenuIsOpened ? fixedWrapperClassList : ''
      )}
    >
      <Header />
      <MobileMenu />
      <main className="relative flex-grow flex-shrink-0 basis-auto">
        {children}
      </main>
      <Footer />
      <Modal
        isOpen={modalState.isModalOpen}
        onClose={onModalClose}
        content={modalState.modalChildren}
        onCloseCb={modalState.onCloseCb}
      />
      <Toaster />
    </div>
  )
}

export default LayoutWrapper
