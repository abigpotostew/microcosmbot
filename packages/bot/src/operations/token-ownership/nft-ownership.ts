import { GroupTokenGateRuleTypes } from '@microcosms/db'
import { z } from 'zod'
import { getDaoDaoContractAndNft, getStakedCount } from '../daodao/get-daodao'
import { getChainInfo } from '../../chains/ChainInfo'

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
  ruleType,
  denom,
  exponent,
  chainId,
  useRemoteCache = false,
}: {
  chainId: string
  contractAddress?: string | null
  owner: string
  denom?: string | null
  exponent?: number | null
  ruleType: GroupTokenGateRuleTypes
  useRemoteCache?: boolean | null
}) => {
  if (useRemoteCache) {
    return getOwnedCountRemote({
      chainId,
      contractAddress: contractAddress ?? undefined,
      owner,
      ruleType,
      denom: denom ?? undefined,
      exponent: exponent ?? undefined,
    })
  } else {
    return getOwnedCountDirect({
      chainId,
      contractAddress: contractAddress ?? undefined,
      owner,
      ruleType,
      denom: denom ?? undefined,
      exponent: exponent ?? undefined,
    })
  }
}

const getOwnedCountRemote = async ({
  chainId,
  contractAddress,
  owner,
  ruleType,
  denom,
  exponent,
}: {
  chainId: string

  contractAddress?: string
  owner: string
  ruleType: GroupTokenGateRuleTypes
  denom?: string
  exponent?: number
}) => {
  const url = new URL(process.env.BASEURL + '/api/stargaze/nft')
  if (contractAddress) {
    url.searchParams.set('contractAddress', contractAddress)
  }
  url.searchParams.set('chainId', chainId)
  url.searchParams.set('owner', owner)
  url.searchParams.set('ruleType', ruleType.toString())
  if (denom) {
    url.searchParams.set('denom', denom)
  }
  if (exponent) {
    url.searchParams.set('exponent', exponent.toString())
  }
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
  denom,
  contractAddress,
  owner,
  ruleType,
  exponent,
  chainId,
}: {
  contractAddress?: string
  owner: string
  ruleType: GroupTokenGateRuleTypes
  denom?: string
  exponent?: number
  chainId: string
}) => {
  if (ruleType === 'DAO_DAO') {
    if (!contractAddress) {
      throw new Error('contractAddress is required for DAO_DAO ruleType')
    }
    return getDaoDaoOwnedCount({ chainId, contractAddress, owner })
  } else if (ruleType === 'TOKEN_FACTORY') {
    if (!denom) {
      throw new Error('denom is required for TOKEN_FACTORY ruleType')
    }
    if (typeof exponent !== 'number') {
      throw new Error('exponent is required for TOKEN_FACTORY ruleType')
    }
    return getTokenFactoryTotalOwnedCount({ chainId, denom, owner, exponent })
  } else {
    if (!contractAddress) {
      throw new Error('contractAddress is required for SG721 ruleType')
    }
    return getSg721OwnedCount({ chainId, contractAddress, owner })
  }
}

const getSg721OwnedCount = async ({
  chainId,
  contractAddress,
  owner,
}: {
  chainId: string

  contractAddress: string
  owner: string
}) => {
  let ownedCount = 0
  let start_after = undefined
  const limit = 100
  do {
    const json: any = await fetchCosmWasm(chainId, contractAddress, {
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

const getDaoDaoOwnedCount = async ({
  chainId,
  contractAddress,
  owner,
}: {
  chainId: string
  contractAddress: string
  owner: string
}) => {
  const contract = await getDaoDaoContractAndNft(chainId, contractAddress)
  if (!contract.ok) {
    console.log(
      `error fetching dao dao contract and nft for '${contractAddress}'. Error code: ${contract.error}`
    )
    return 0
  }
  return getStakedCount(chainId, contract.value.voting_module_address, owner)
}

const getTokenFactoryTotalOwnedCount = async ({
  chainId,
  denom,
  owner,
  exponent,
}: {
  chainId: string

  denom: string
  owner: string
  exponent: number
}) => {
  const [delegations, balance] = await Promise.all([
    getDelegatedTokenCount({ chainId, owner, denom, exponent }),
    getTokenFactoryOwnedCount({ chainId, denom, owner, exponent }),
  ])
  return delegations + balance
}
const getTokenFactoryOwnedCount = async ({
  chainId,
  denom,
  owner,
  exponent,
}: {
  chainId: string
  denom: string
  owner: string
  exponent: number
}) => {
  const path = `/cosmos/bank/v1beta1/balances/${owner}/by_denom?denom=${denom}`
  const res = await fetchRest(chainId, path)
  // {"balance":{"denom":"ustars","amount":"2581404290"}}
  if (!res.ok) {
    console.log(
      'failed to fetch denom balance',
      res.status,
      res.statusText,
      await res.text()
    )
    return 0
  }
  const json = await res.json()
  const amount = json.balance?.amount
  if (typeof amount !== 'string') {
    return 0
  }
  return convertDenomToFloat(amount, exponent)
}
const convertDenomToFloat = (denom: string, exponent: number) => {
  const n = parseInt(denom)
  if (isNaN(n)) {
    return 0
  }
  if (exponent === 0) {
    return n
  }
  return n / 10 ** exponent
}

const delegationsSchema = z.object({
  delegation_responses: z.array(
    z.object({
      // delegation: z.object({
      //   delegator_address: z.string(),
      //   validator_address: z.string(),
      //   shares: z.string(),
      // }),
      balance: z.object({
        denom: z.string(),
        amount: z.string(),
      }),
    })
  ),
  pagination: z.object({
    next_key: z.string().nullable(),
    total: z.string(),
  }),
})

const getDelegatedTokenCount = async ({
  chainId,
  owner,
  denom,
  exponent,
}: {
  chainId: string
  owner: string
  denom: string
  exponent: number
}) => {
  ///cosmos/staking/v1beta1/delegations/stars1ev6dj8ttxjt2psy5hzevhzl9j9aj5cvcj3pyhr
  //{"delegation_responses":[{"delegation":{"delegator_address":"stars1ev6dj8ttxjt2psy5hzevhzl9j9aj5cvcj3pyhr","validator_address":"starsvaloper1ej2es5fjztqjcd4pwa0zyvaevtjd2y5wuske5h","shares":"500122072.000000000000000000"},"balance":{"denom":"ustars","amount":"500122072"}}],"pagination":{"next_key":null,"total":"1"}}
  let key: string | null = null
  let total = 0
  let i = 0
  do {
    ++i
    const path =
      `/cosmos/staking/v1beta1/delegations/${owner}` +
      (key ? `?key=${key}` : '')
    const res = await fetchRest(chainId, path)
    if (!res.ok) {
      console.log(
        'failed to fetch delegations',
        res.status,
        res.statusText,
        await res.text()
      )
      return 0
    }
    const json = await res.json()
    const result = delegationsSchema.safeParse(json)
    if (!result.success) {
      console.log('invalid delegations response', result.error.format())
      return 0
    }
    const delegations = result.data.delegation_responses || []
    for (const d of delegations) {
      const balance = d.balance
      if (balance.denom === denom) {
        total += convertDenomToFloat(balance.amount, exponent)
      }
    }
    key = result.data.pagination.next_key
  } while (!!key && i < 100)
  return total
}

export const fetchCosmWasm = async (
  chainId: string,
  contractAddress: string,
  msgObj: object
): Promise<any> => {
  const msg = msgBase64(msgObj)
  const res = await fetchRest(
    chainId,
    `/cosmwasm/wasm/v1/contract/${contractAddress}/smart/${msg}`
  )
  if (!res.ok) {
    console.log(`failed to fetch`, res.status, res.statusText, await res.text())
    throw new Error(`failed to fetch`)
  }
  return res.json()
}

const fetchRest = async (chainId: string, path: string): Promise<any> => {
  const chain = getChainInfo(chainId)
  if (!chain) {
    throw new Error('chain not found')
  }
  const url = `${chain.rest}${path}`
  // return false
  console.log('fetching', url)
  return fetch(url)
}

export const fetchDenomExponent = async (
  chainId: string,
  denom: string
): Promise<number | null> => {
  const isAllowed = isDenomAllowed(chainId, denom)
  if (!isAllowed) {
    return null
  }
  if (typeof isAllowed.decimals == 'number') {
    return isAllowed.decimals
  }
  const res = await fetchRest(
    chainId,
    `/cosmos/bank/v1beta1/denoms_metadata/${denom}`
  )
  if (!res.ok) {
    console.log(
      'failed to fetch denom metadata',
      res.status,
      res.statusText,
      await res.text()
    )
    return null
  }
  //{"metadata":{"description":"The native token of Stargaze","denom_units":[{"denom":"ustars","exponent":0,"aliases":["microstars"]},{"denom":"stars","exponent":6,"aliases":[]}],"base":"ustars","display":"stars","name":"Stargaze STARS","symbol":"STARS","uri":"","uri_hash":""}}
  const json = await res.json()
  //grab the display exponent
  const displayName = json.metadata?.display
  // find it in the denom_units
  const exponent = json.metadata?.denom_units?.find(
    (u: any) => u.denom === displayName
  )?.exponent
  if (typeof exponent === 'number') {
    return exponent
  }
  return null
}

const allowedDenomsSchema = z.record(
  z.string(),
  z.array(
    z.object({
      denom: z.string(),
      decimals: z.number().nullish(),
    })
  )
)
type AllowedDenoms = z.infer<typeof allowedDenomsSchema>

const isDenomAllowed = (chainId: string, denom: string) => {
  const configString = process.env.ALLOWED_DENOMS
  if (!configString) {
    return null
  }
  let data: AllowedDenoms | null = null
  try {
    const allowedDenoms = JSON.parse(configString)
    data = allowedDenomsSchema.parse(allowedDenoms)
  } catch (e) {
    console.log('error parsing ALLOWED_DENOMS', e)
    return null
  }
  if (!data || !data[chainId]) {
    return null
  }
  const denomFound = data[chainId].find((d) => d.denom === denom)
  if (!denomFound) {
    return null
  }

  return denomFound
}
