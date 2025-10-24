import { fetchCosmWasm } from '../token-ownership/nft-ownership'
import { ErrorCodes } from './errors.types'

type DumpState = {
  data: {
    voting_module: string
    config: { name: string }
    version: {
      contract: string //"crates.io:dao-dao-core",
      version: string //"2.3.0"
    }
  }
}
type VotingModuleConfig = {
  data: {
    nft_address: string //
  }
}
type NftConfig = {
  data: {
    // "creator": "stars18zwgf4kvwxpyejde5dyudjl9jkl7a4fttnrqpy",
    // "description": "Meet Adora! UMEE's first and cutest digital collectible. 1000 of these Adorabilis are crossing the defi waves using UMEE's borrowing and lending platform. Check out more on https://umee.cc/",
    image: string //'ipfs://bafybeidr4hu5wg4fsfro7utqewszoauo22c2bpchrqwt6eqiu6fiyuvjiy/1001.gif'
    // "external_link": "https://umee.cc/",
    // "explicit_content": false,
    // "start_trading_time": "1673158500000000000",
    // "royalty_info": {
    //   "payment_address": "stars18zwgf4kvwxpyejde5dyudjl9jkl7a4fttnrqpy",
    //   "share": "0.05"
    // }
  }
}
type ContractInfo = {
  data: {
    name: string // "Adora",
    symbol: string //"ADORA"
  }
}

type Result<T> = { ok: true; value: T } | { ok: false; error: ErrorCodes }
export const Ok = <T>(value: T): Result<T> => ({ ok: true, value })
export const Err = (error: ErrorCodes): Result<never> => ({ ok: false, error })
type DaoDaoResult = {
  nft_address: string
  voting_module_address: string
  nft: {
    name: string
    coverImage: string
  }
}
export const getDaoDaoContractAndNft = async (
  chainId: string,
  contractAddress: string
): Promise<Result<DaoDaoResult>> => {
  try {
    const dump_state: DumpState = await fetchCosmWasm(
      chainId,
      contractAddress,
      {
        dump_state: {},
      }
    )
    if (dump_state.data.version.contract !== 'crates.io:dao-dao-core') {
      return Err(ErrorCodes.NOT_DAO_DAO_CORE)
    }

    const voting_module_address = dump_state.data.voting_module
    if (typeof voting_module_address !== 'string') {
      console.log('voting_module_address not found')
      return Err(ErrorCodes.VOTING_MODULE_NOT_FOUND)
    }
    const vote_nft_config: VotingModuleConfig = await fetchCosmWasm(
      chainId,
      voting_module_address,
      {
        config: {},
      }
    )

    const nft_address = vote_nft_config.data.nft_address
    if (typeof nft_address !== 'string') {
      console.log('nft_address not found')
      return Err(ErrorCodes.NOT_NFT_VOTING_MODULE)
    }

    //further query the nft contract??
    let collection_info: NftConfig
    try {
      collection_info = await fetchCosmWasm(chainId, nft_address, {
        collection_info: {},
      })
    } catch (e) {
      console.log('error fetching nft collection_info: ', e)
      return Err(ErrorCodes.INVALID_NFT_COLLECTION_INFO)
    }

    let contract_info: ContractInfo
    try {
      contract_info = await fetchCosmWasm(chainId, nft_address, {
        contract_info: {},
      })
    } catch (e) {
      console.log('error fetching nft contract_info: ', e)
      return Err(ErrorCodes.INVALID_NFT_COLLECTION_INFO)
    }

    const nft = {
      name: contract_info.data.name,
      coverImage: collection_info.data.image,
    }

    return Ok({ nft_address, voting_module_address, nft })
  } catch (e) {
    console.log('error fetching dao dao contract and nft: ', e)
    return Err(ErrorCodes.NOT_DAO_DAO_CORE)
  }
}

export const getStakedCount = async (
  chainId: string,
  voting_module_address: string,
  owner: string
) => {
  let start_after: string | undefined = undefined
  const limit = 100
  let ownedCount = 0
  do {
    const stakedTokensRes: { data: string[] } = await fetchCosmWasm(
      chainId,
      voting_module_address,
      {
        staked_nfts: { address: owner, start_after, limit },
      }
    )
    const stakedTokens = stakedTokensRes.data
    ownedCount += stakedTokens.length
    if (stakedTokens.length === 0 || stakedTokens.length < limit) {
      break
    }
    start_after = stakedTokens[stakedTokens.length - 1]
  } while (true)
  return ownedCount
}
