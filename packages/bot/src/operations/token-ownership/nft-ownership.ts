import { config } from '../../config'
import { getDaoDaoContractAndNft, getStakedCount } from '../daodao/get-daodao'

interface TokensMsg {
  owner: String
  start_after?: string
  limit: number
}

const msgBase64 = (msg: object) => {
  return Buffer.from(JSON.stringify(msg)).toString('base64')
}
const tokenMsgBase64 = (msg: TokensMsg) => {
  return msgBase64({ tokens: msg })
}

export const getOwnedCount = async ({
  contractAddress,
  owner,
  isDaoDao,
  useRemoteCache = false,
}: {
  contractAddress: string
  owner: string
  isDaoDao: boolean
  useRemoteCache?: boolean
}) => {
  if (useRemoteCache) {
    return getOwnedCountRemote({ contractAddress, owner, isDaoDao })
  } else {
    return getOwnedCountDirect({ contractAddress, owner, isDaoDao })
  }
}

const getOwnedCountRemote = async ({
  contractAddress,
  owner,
  isDaoDao,
}: {
  contractAddress: string
  owner: string
  isDaoDao: boolean
}) => {
  const url = new URL(process.env.BASEURL + '/api/stargaze/nft')
  url.searchParams.set('contractAddress', contractAddress)
  url.searchParams.set('owner', owner)
  url.searchParams.set('isDaoDao', isDaoDao.toString())
  const res = await fetch(url.href)
  if (!res.ok) {
    throw new Error('failed to fetch tokens')
  }
  const json = await res.json()
  if (typeof json.count !== 'number') {
    throw new Error('invalid response')
  }
  return json.count as number
}

const getOwnedCountDirect = async ({
  contractAddress,
  owner,
  isDaoDao,
}: {
  contractAddress: string
  owner: string
  isDaoDao: boolean
}) => {
  if (isDaoDao) {
    const contract = await getDaoDaoContractAndNft(contractAddress)
    if (!contract.ok) {
      console.log(
        `error fetching dao dao contract and nft for '${contractAddress}'. Error code: ${contract.error}`
      )
      return 0
    }
    const staked = await getStakedCount(
      contract.value.voting_module_address,
      owner
    )
    return staked
  }
  let ownedCount = 0
  let start_after = undefined
  const limit = 100
  do {
    const json: any = await fetchCosmWasm(contractAddress, {
      tokens: {
        owner,
        limit,
        start_after,
      },
    })
    const tokens = json.data?.tokens || []
    ownedCount += tokens.length
    if (tokens.length === 0 || tokens.length < limit) {
      break
    }
    start_after = tokens[tokens.length - 1]
  } while (true)
  return ownedCount
}

export const fetchCosmWasm = async (
  contractAddress: string,
  msgObj: object
): Promise<any> => {
  const msg = msgBase64(msgObj)
  const url = `${config.chainRestUrl}/cosmwasm/wasm/v1/contract/${contractAddress}/smart/${msg}`
  // return false
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`failed to fetch '${url}'`)
  }
  return res.json()
}
