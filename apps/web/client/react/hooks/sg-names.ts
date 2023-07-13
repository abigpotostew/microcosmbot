import { useQuery, useQuery as useReactQuery } from '@tanstack/react-query'
import chainInfo from '../../ChainInfo'

const base64Encode = (obj: any) => {
  return Buffer.from(JSON.stringify(obj)).toString('base64')
}
export function useWalletName(address: string) {
  const key = ['walletName', address]
  console.log('key', key)
  const fetcher = async () => {
    if (!address) {
      console.log('no address')
      return ''
    }

    try {
      const encoded = base64Encode({ name: { address } })
      console.log(
        'fetching wallet name',
        `${chainInfo.rest}/cosmwasm/wasm/v1/contract/${chainInfo.nameCollectionContract}/smart/${encoded}`
      )
      const response = await fetch(
        `${chainInfo.rest}/cosmwasm/wasm/v1/contract/${chainInfo.nameCollectionContract}/smart/${encoded}`
      )
      if (!response.ok) {
        console.log('response not ok')
        return ''
      }
      const { data } = await response.json()
      console.log('name data', data)
      return data && typeof data === 'string' ? data : ''
    } catch (e) {
      console.error('failed to fetch wallet name', e)
      return ''
    }
  }
  return useReactQuery(key, fetcher, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  })
}

export function useNameInfo(name: string) {
  const key = ['nftNameInfo', name]
  const fetcher = async () => {
    if (!name) {
      return null
    }
    const encoded = base64Encode({ nft_info: { token_id: name } })
    try {
      const response = await fetch(
        `${chainInfo.rest}/cosmwasm/wasm/v1/contract/${chainInfo.nameCollectionContract}/smart/${encoded}`
      )
      if (!response.ok) {
        return ''
      }
      return (await response.json())?.data as any | ''
    } catch (e) {
      console.error(e)
      return ''
    }
  }

  return useReactQuery(key, fetcher)
}

export function useProfileInfo({ address }: { address?: string }) {
  const { data: nameOfWallet, isLoading } = useWalletName(address ?? '')
  const nameInfo = useNameInfo(nameOfWallet ?? '')

  const textRecords =
    typeof nameInfo.data === 'object'
      ? nameInfo.data?.extension?.records
      : undefined

  return {
    // profileMedia: profileToken?.token?.media,
    walletName: nameOfWallet,
    // nameOwner: nameOwner?.owner,
    textRecords,
    isLoading,
  }
}
