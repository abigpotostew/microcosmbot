// SPDX-License-Identifier: GPL-3.0-or-later

import { tokenAddresses } from 'constants/tokenAddresses'
import { atom } from 'recoil'

export interface Token {
  name: string
  address: string
  symbol: string
  logoUri: string
  chainId: number
  decimals: number
}

export interface TokenListStateProps {
  goerli: Token[]
  mainnet: Token[]
  homestead: Token[]
  arbitrum: Token[]
  optimism: Token[]
  polygon: Token[]
}

export const tokenListState = atom<TokenListStateProps>({
  key: 'tokenListState',
  default: {
    goerli: [
      {
        name: 'Ether',
        address: tokenAddresses.default.ETH,
        symbol: 'ETH',
        chainId: 5,
        logoUri: 'https://ethereum-optimism.github.io/data/ETH/logo.svg',
        decimals: 18,
      },
      {
        name: 'Wrapped Ether',
        address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        symbol: 'WETH',
        chainId: 5,
        logoUri: 'https://ethereum-optimism.github.io/data/WETH/logo.png',
        decimals: 18,
      },
      {
        name: 'Uniswap',
        address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        symbol: 'UNI',
        chainId: 5,
        decimals: 18,
        logoUri:
          'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
      },
      {
        name: 'USD Coin',
        address: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        symbol: 'USDC',
        chainId: 5,
        logoUri: 'https://ethereum-optimism.github.io/data/USDC/logo.png',
        decimals: 6,
      },
      {
        name: 'Dai Stablecoin',
        address: '0x73967c6a0904aA032C103b4104747E88c566B1A2',
        symbol: 'DAI',
        chainId: 5,
        logoUri: 'https://ethereum-optimism.github.io/data/DAI/logo.svg',
        decimals: 18,
      },
    ],
    mainnet: [],
    homestead: [],
    arbitrum: [],
    optimism: [],
    polygon: [],
  },
})
