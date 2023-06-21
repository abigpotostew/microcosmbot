// SPDX-License-Identifier: GPL-3.0-or-later

import { Input } from '@microcosmbot/ui'
import SearchIcon from 'public/icons/explorer-icon.svg'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Token, tokenListState, TokenListStateProps } from 'state/TokenList'
import BulletIcon from 'public/icons/bullet-icon.svg'
import PendingIcon from 'public/icons/pending-icon.svg'

const suggestionTokensList = ['ETH', 'DAI', 'USDC', 'USDT', 'WBTC', 'WETH']

interface FormSelectTokenProps {
  network: string
  onTokenSelected: (token: Token) => void
}

const FormSelectToken: React.FC<FormSelectTokenProps> = ({
  network,
  onTokenSelected,
}) => {
  const [tokensList] = useRecoilState(tokenListState)
  const [networkTokensList, setNetworkTokensList] = useState<Token[]>([])
  const [filteredNetworkTokensList, setFilteredNetworkTokensList] = useState<
    Token[]
  >([])
  const [networkSuggestedTokensList, setNetworkSuggestedTokensList] = useState<
    Token[]
  >([])
  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    if (!network) {
      return
    }

    setNetworkTokensList(tokensList[network as keyof TokenListStateProps])
    setNetworkSuggestedTokensList(
      tokensList[network as keyof TokenListStateProps]?.filter((t) =>
        suggestionTokensList.includes(t.symbol)
      )
    )
  }, [network]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setFilteredNetworkTokensList(networkTokensList)
  }, [networkTokensList])

  useEffect(() => {
    if (searchValue === '' || searchValue === undefined) {
      setFilteredNetworkTokensList(networkTokensList)
      return
    }

    setFilteredNetworkTokensList(
      networkTokensList?.filter(
        (x) =>
          x.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          x.symbol?.toLowerCase().includes(searchValue.toLowerCase()) ||
          x.address?.toLowerCase().includes(searchValue.toLowerCase())
      )
    )
  }, [searchValue]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(ev.currentTarget.value)
  }

  return (
    <>
      <h2 className="absolute top-6 left-10 z-50 ">Select a token</h2>
      <div className="modal-token-list box-border w-full bg-olive-100 flex flex-col items-center pt-10 pb-7 pr-10 pl-10 px-4">
        <Input
          name="search"
          placeholder="Search name or paste address"
          onChange={handleSearchInputChange}
          classes="w-full mt-10 mb-4"
          endAdornment={
            <SearchIcon className="w-5 h-5 absolute top-3 right-4" />
          }
        />
        {networkSuggestedTokensList &&
          networkSuggestedTokensList?.length > 0 && (
            <div className="flex flex-row flex-wrap mb-4 mr-auto">
              {networkSuggestedTokensList?.map((suggestedToken) => (
                <div
                  onClick={() => onTokenSelected(suggestedToken)}
                  key={suggestedToken.name}
                  className="flex flex-row mr-4 items-center border rounded-2xl p-2 mt-2 hover:bg-olive-200 cursor-pointer"
                >
                  <picture>
                    <img
                      src={suggestedToken.logoUri}
                      alt={suggestedToken.symbol}
                      className="h-8 w-8 rounded-full"
                    />
                  </picture>
                  <div className="ml-2">
                    <p className="text-lg">{suggestedToken.symbol}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        <div className="overflow-scroll flex flex-col max-h-96 w-full border-t">
          {filteredNetworkTokensList?.length > 0 ? (
            filteredNetworkTokensList.map((token) => (
              <div
                onClick={() => onTokenSelected(token)}
                key={token.name}
                className="w-full flex mt-2 hover:bg-olive-200 cursor-pointer p-1 items-center"
              >
                <picture>
                  <img
                    src={token.logoUri}
                    alt={token.symbol}
                    className="h-11 w-11 rounded-full"
                  />
                </picture>
                <div className="ml-4">
                  <p className="text-lg">{token.name}</p>
                  <p className="text-sm opacity-50">{token.symbol}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center modal-token-loader">
              <BulletIcon className="w-8 h-8" />
              <PendingIcon className="loader-icon absolute w-5 h-5" />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default FormSelectToken
