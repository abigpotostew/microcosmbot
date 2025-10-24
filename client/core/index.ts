import type { ChainInfo } from '@keplr-wallet/types'
import type { WalletData } from './wallet'
import type {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'

const getCosmWasmClientImport = import('./cosmwasm/getCosmWasmClient')

export interface StargazeClientContructor {
  wallet: WalletData | null
  chainInfo: ChainInfo
  wagerContract: string
  signingCosmWasmClient: SigningCosmWasmClient | null
}

export class StargazeClient {
  private _cosmWasmClient: CosmWasmClient | null = null
  public signingCosmWasmClient: SigningCosmWasmClient | null = null

  public wagerContract: string
  public chainInfo: ChainInfo

  private _wallet: WalletData | null = null

  constructor({
    wallet,
    chainInfo,
    wagerContract,
    signingCosmWasmClient,
  }: StargazeClientContructor) {
    this._wallet = wallet
    this.chainInfo = chainInfo
    this.wagerContract = wagerContract
    this.signingCosmWasmClient = signingCosmWasmClient
  }

  public async connect() {
    if (this._cosmWasmClient) {
      return
    }

    const getCosmWasmClient = (await getCosmWasmClientImport).default
    // create cosmwasm client
    this._cosmWasmClient = await getCosmWasmClient(this.chainInfo.rpc)
  }

  public get cosmWasmClient(): CosmWasmClient {
    return this._cosmWasmClient as CosmWasmClient
  }

  public get wallet(): WalletData {
    return this._wallet as WalletData
  }
}
