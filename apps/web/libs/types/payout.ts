import { HTMLAttributes } from "react"
import { Token } from "state/TokenList"

export type PayoutType = 'phased' | 'periodic'

export type PayoutItemProps = IPayoutItem & HTMLAttributes<HTMLDivElement>

export interface IPayoutItem {
  id: string
  address: `0x${string}`
  data: string
  balance: string
  blockNumber: string
  blockTimestamp: string
  controller: string
  nextPayment: Date | string | number
  paused: boolean
  recipient: string
  transactionHash: string
  type: PayoutType
}

export interface IPayoutsStats {
  total: number
  senders: number
  receivers: number
}

export interface DepositBlockProps {
  address: `0x${string}`
  token: Token
  onSubmitCb?: () => Promise<void> | void
}

export type DepositForm = Record<'amount', string>

export enum ActivityEvent {
  StreamCreated = 'StreamCreated',
  FundsDisbursed = 'FundsDisbursed',
  ControllerUpdated = 'ControllerUpdated',
  StreamPaused = 'StreamPaused',
  StreamUnpaused = 'StreamUnpaused',
  Withdrawal = 'Withdrawal',
}

export interface ActivityEventItemProps {
  icon: string
  text: string
}

export interface IActivity {
  id: string
  event: ActivityEvent
  message: string
  type: string
  address: string
  blockNumber: string
  blockTimestamp: string
  transactionHash: string
}

export type ActivitiesShape = Record<ActivityEvent, ActivityEventItemProps>

export interface StreamData {
  tip: string
  msPayments?: number[]
  msDates?: number[]
  currentMilestone?: string
  interval?: string
  owed?: string
  paid?: string
  startDate?: string
  endDate?: string
}