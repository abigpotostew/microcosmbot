import type { Coin } from '@cosmjs/amino'

export interface WalletData {
  readonly address: string
  readonly name?: string
  readonly balance?: Coin
}
