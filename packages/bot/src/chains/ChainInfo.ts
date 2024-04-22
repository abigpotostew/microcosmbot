import { ChainInfoNew, ChainInfos } from './config'

export const getChainInfo = (chainId: string): ChainInfoNew | undefined => {
  return ChainInfos.find((chain) => chain.chainId === chainId)
}
