import { Bech32Address } from '@keplr-wallet/cosmos'
import { ChainInfo } from '@keplr-wallet/types'

export interface ChainInfoWithExplorer extends ChainInfo {
  // Formed as "https://explorer.com/{txHash}"
  explorerUrlToTx: string
  coinType: number
  nameCollectionContract: string
}

export const ChainInfos: ChainInfoWithExplorer[] = [
  {
    rpc: 'https://rpc.stargaze-apis.com',
    rest: 'https://rest.stargaze-apis.com',
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
    nameCollectionContract:
      'stars1fx74nkqkw2748av8j7ew7r3xt9cgjqduwn8m0ur5lhe49uhlsasszc5fhr',
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
    nameCollectionContract:
      'stars1rgn9tuxnl3ju9td3mfxdl2vm4t8xuaztcdakgtyx23c4ffm97cus25fvjs',
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
