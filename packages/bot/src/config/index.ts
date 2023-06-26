export interface ConfigInfo {
  chainName: string
  chainId: string
  chainRestUrl: string
}
export const config: ConfigInfo = {
  chainName: process.env.NEXT_PUBLIC_CHAINNAME || 'stargaze',
  chainId: process.env.NEXT_PUBLIC_CHAINID || 'stargaze-1',
  chainRestUrl:
    process.env.NEXT_PUBLIC_CHAINRESTURL || 'https://rest.stargaze-apis.com',
}
