import { ChainInfo } from '@keplr-wallet/types/build/chain-info'
import { ChainInfos } from 'config'

let chainInfo: ChainInfo
switch (process?.env.NEXT_PUBLIC_NETWORK) {
  case 'stargaze':
    chainInfo = ChainInfos[0]
    break
  case 'stargazetestnet':
    chainInfo = ChainInfos[2]
    break
  default:
    chainInfo = ChainInfos[0]
}

export default chainInfo
