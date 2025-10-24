import { BigNumber, ContractTransaction } from 'ethers'

export interface IMs {
  name: string
  msPayments: string
  msDates: Date
}

export interface IMilestonesValidated {
  owner: `0x${string}` | undefined
  ms: IMs[]
  tip: number | undefined
  recipient: `0x${string}` | undefined
}

export type LoadingStateStatus = 'pending' | 'finished'

export interface FormProcessStep {
  status: LoadingStateStatus
  text: string
}

export interface TransactionLoadingStates {
  steps: {
    approval: FormProcessStep
    deploy: FormProcessStep
  }
  contractTransaction: ContractTransaction | undefined
}
