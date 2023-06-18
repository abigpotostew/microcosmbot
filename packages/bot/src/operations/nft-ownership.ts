interface TokensMsg {
  owner: String
  start_after?: string
  limit: number
}
const msgBase64 = (msg: TokensMsg) => {
  return Buffer.from(JSON.stringify({ tokens: msg })).toString('base64')
}
export const getOwnedCount = async ({
  contractAddress,
  owner,
  useRemoteCache = false,
}: {
  contractAddress: string
  owner: string
  useRemoteCache?: boolean
}) => {
  if (useRemoteCache) {
    return getOwnedCountRemote({ contractAddress, owner })
  } else {
    return getOwnedCountDirect({ contractAddress, owner })
  }
}

const getOwnedCountRemote = async ({
  contractAddress,
  owner,
}: {
  contractAddress: string
  owner: string
}) => {
  const url = new URL(process.env.BASEURL + '/api/stargaze/nft')
  url.searchParams.set('contractAddress', contractAddress)
  url.searchParams.set('owner', owner)
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
}: {
  contractAddress: string
  owner: string
}) => {
  let ownedCount = 0
  let start_after = undefined
  const limit = 100
  do {
    const msg = msgBase64({
      owner,
      limit,
      start_after,
    })
    const url = `${'https://rest.stargaze-apis.com'}/cosmwasm/wasm/v1/contract/${contractAddress}/smart/${msg}`
    // return false
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error('failed to fetch tokens')
    }
    const json = await res.json()
    const tokens = json.data?.tokens || []
    ownedCount += tokens.length
    if (tokens.length === 0 || tokens.length < limit) {
      break
    }
    start_after = tokens[tokens.length - 1]
  } while (true)
  return ownedCount
}
