import type { Coin } from '@cosmjs/amino'
import { AccountData } from 'cosmwasm'

export interface WalletData extends AccountData {
  readonly address: string
  readonly name?: string
  readonly balance?: Coin
}
