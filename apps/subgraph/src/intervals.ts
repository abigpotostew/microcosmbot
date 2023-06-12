import { log, BigInt } from '@graphprotocol/graph-ts'
import {
  FundsDisbursed as FundsDisbursedEvent,
  OwnerUpdated as IntervalsOwnerUpdatedEvent,
  Paused as PausedEvent,
  Unpaused as UnpausedEvent,
  Intervals,
  Withdraw as WithdrawEvent,
} from '../generated/templates/Intervals/Intervals'
import {
  FundsDisbursed,
  IntervalsInitialized,
  IntervalsOwnerCanceled,
  IntervalsOwnerPending,
  IntervalsOwnerUpdated,
  Paused,
  IntervalsStreamCreated,
  Unpaused,
  Stream,
  Activity,
} from '../generated/schema'
import { getPeriodicDynamicData } from './utils'

export function handleFundsDisbursed(event: FundsDisbursedEvent): void {
  let entity = new FundsDisbursed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.streamId = event.params.streamId
  entity.amount = event.params.amount
  entity.streamType = event.params.streamType

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const stream = Stream.load(event.address)
  const contract = Intervals.bind(event.address)
  const curInv = contract.getCurrentInterval()

  if (stream == null) {
    log.error('[handleIntervalFundsDisbursed] Stream #{} not found. Hash: {}', [
      event.address.toString(),
      event.transaction.hash.toHex(),
    ])
    return
  }

  if (contract) {
    stream.controller = contract.owner().toHexString()
    stream.paused = contract.paused()
    const intMap = contract.getCurrentInterval()

    const balRes = contract.try_balance()
    if (!balRes.reverted) {
      stream.balance = balRes.value
    } else {
      stream.balance = BigInt.fromI32(0)
    }

    const payRes = contract.try_nextPayment()

    if (!payRes.reverted) {
      stream.nextPayment = payRes.value
    } else {
      stream.nextPayment = BigInt.fromI32(0)
    }

    stream.data = getPeriodicDynamicData(intMap)
    stream.save()
  }

  const activity = new Activity(event.transaction.hash)
  activity.type = 'periodic'
  activity.message = `Funds disbursed: ${event.address.toHexString()} amount: ${event.params.amount.toString()} recipient: ${curInv.value6.toHexString()}`
  activity.address = event.address
  activity.event = 'FundsDisbursed'
  activity.blockNumber = event.block.number
  activity.blockTimestamp = event.block.timestamp
  activity.transactionHash = event.transaction.hash
  activity.save()
}

export function handleIntervalsOwnerUpdated(
  event: IntervalsOwnerUpdatedEvent
): void {
  let entity = new IntervalsOwnerUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.prevOwner = event.params.prevOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const stream = Stream.load(event.address)

  if (stream == null) {
    log.error('[handleIntervalsOwnerUpdated] Stream #{} not found. Hash: {}', [
      event.address.toString(),
      event.transaction.hash.toHex(),
    ])
    return
  }

  stream.controller = event.params.newOwner.toHexString()
  stream.save()

  const activity = new Activity(event.transaction.hash)
  activity.type = 'phased'
  activity.message = `Controller Updated Updated: ${
    event.address
  } controller: ${event.params.newOwner.toHexString()}`
  activity.address = event.address
  activity.event = 'ControllerUpdated'
  activity.blockNumber = event.block.number
  activity.blockTimestamp = event.block.timestamp
  activity.transactionHash = event.transaction.hash
  activity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const stream = Stream.load(event.address)

  if (stream == null) {
    log.error('[handleMilestonesStreamPaused] Stream #{} not found. Hash: {}', [
      event.address.toString(),
      event.transaction.hash.toHex(),
    ])
    return
  }

  stream.paused = true
  stream.save()

  const activity = new Activity(event.transaction.hash)
  activity.type = 'periodic'
  activity.message = `Stream Paused: ${event.address.toHexString()} paused: true`
  activity.address = event.address
  activity.event = 'StreamPaused'
  activity.blockNumber = event.block.number
  activity.blockTimestamp = event.block.timestamp
  activity.transactionHash = event.transaction.hash
  activity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const stream = Stream.load(event.address)

  if (stream == null) {
    log.error('[handleStreamUnpaused] Stream #{} not found. Hash: {}', [
      event.address.toString(),
      event.transaction.hash.toHex(),
    ])
    return
  }

  stream.paused = false
  stream.save()

  const activity = new Activity(event.transaction.hash)
  activity.type = 'periodic'
  activity.message = `Stream Unpaused: ${event.address.toString()} paused: false`
  activity.address = event.address
  activity.event = 'StreamUnpaused'
  activity.blockNumber = event.block.number
  activity.blockTimestamp = event.block.timestamp
  activity.transactionHash = event.transaction.hash
  activity.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
  const activity = new Activity(event.transaction.hash)
  activity.type = 'periodic'
  activity.message = `Withdrawl: ${event.address.toHexString()} amount: ${
    event.params.amount
  }`
  activity.address = event.address
  activity.event = 'Withdrawal'
  activity.blockNumber = event.block.number
  activity.blockTimestamp = event.block.timestamp
  activity.transactionHash = event.transaction.hash
  activity.save()
}
