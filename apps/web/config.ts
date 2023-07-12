import { Bech32Address } from '@keplr-wallet/cosmos'
import { ChainInfo } from '@keplr-wallet/types'

export interface ChainInfoWithExplorer extends ChainInfo {
  // Formed as "https://explorer.com/{txHash}"
  explorerUrlToTx: string
  coinType: number
}

export const ChainInfos: ChainInfoWithExplorer[] = [
  {
    rpc: 'https://rpc.stargaze-apis.com/',
    rest: 'https://rest.stargaze-apis.com/',
    chainId: 'stargaze-1',
    chainName: 'Stargaze',
    stakeCurrency: {
      coinDenom: 'STARS',
      coinMinimalDenom: 'ustars',
      coinDecimals: 6,
      coinGeckoId: 'stars',
      coinImageUrl: 'https://stargaze.zone/logo.png',
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config('stars'),
    currencies: [
      {
        coinDenom: 'STARS',
        coinMinimalDenom: 'ustars',
        coinDecimals: 6,
        coinGeckoId: 'stars',
        coinImageUrl: 'https://stargaze.zone/logo.png',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'STARS',
        coinMinimalDenom: 'ustars',
        coinDecimals: 6,
        coinGeckoId: 'stargaze',
        coinImageUrl: 'https://stargaze.zone/logo.png',
      },
    ],
    coinType: 118,
    features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
    explorerUrlToTx: 'https://www.mintscan.io/stargaze/txs/{txHash}',
  },
  {
    rpc: 'https://rpc.devnet.publicawesome.dev/',
    rest: 'https://rest.devnet.publicawesome.dev/',
    chainId: 'stargaze-devnet-1',
    chainName: 'Stargaze Devnet',
    stakeCurrency: {
      coinDenom: 'STARS',
      coinMinimalDenom: 'ustars',
      coinDecimals: 6,
      coinGeckoId: 'stars',
      coinImageUrl: 'https://stargaze.zone/logo.png',
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config('stars'),
    currencies: [
      {
        coinDenom: 'STARS',
        coinMinimalDenom: 'ustars',
        coinDecimals: 6,
        coinGeckoId: 'stars',
        coinImageUrl: 'https://stargaze.zone/logo.png',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'STARS',
        coinMinimalDenom: 'ustars',
        coinDecimals: 6,
        coinGeckoId: 'stargaze',
        coinImageUrl: 'https://stargaze.zone/logo.png',
      },
    ],
    coinType: 118,
    features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
    explorerUrlToTx: 'https://www.mintscan.io/stargaze/txs/{txHash}',
  },
  {
    rpc: 'https://rpc.elgafar-1.stargaze-apis.com/',
    rest: 'https://rest.elgafar-1.stargaze-apis.com/',
    chainId: 'elgafar-1',
    chainName: 'Stargaze Testnet',
    stakeCurrency: {
      coinDenom: 'STARS',
      coinMinimalDenom: 'ustars',
      coinDecimals: 6,
      coinGeckoId: 'stars',
      coinImageUrl: 'https://stargaze.zone/logo.png',
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config('stars'),
    currencies: [
      {
        coinDenom: 'STARS',
        coinMinimalDenom: 'ustars',
        coinDecimals: 6,
        coinGeckoId: 'stars',
        coinImageUrl: 'https://stargaze.zone/logo.png',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'STARS',
        coinMinimalDenom: 'ustars',
        coinDecimals: 6,
        coinGeckoId: 'stargaze',
        coinImageUrl: 'https://stargaze.zone/logo.png',
      },
    ],
    coinType: 118,
    features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
    explorerUrlToTx: 'https://www.mintscan.io/stargaze/txs/{txHash}',
  },
]
