import { log, BigInt } from '@graphprotocol/graph-ts'
import {
  Milestones,
  FundsDisbursed as MilestonesFundsDisbursedEvent,
  OwnerUpdated as MilestonesOwnerUpdatedEvent,
  Paused as MilestonesPausedEvent,
  Unpaused as MilestonesUnpausedEvent,
  Withdraw as MilestonesWithdrawEvent,
} from '../generated/templates/Milestones/Milestones'

import {
  Activity,
  MilestonesFundsDisbursed,
  MilestonesInitialized,
  MilestonesOwnerCanceled,
  MilestonesOwnerPending,
  MilestonesOwnerUpdated,
  MilestonesPaused,
  MilestonesStreamCreated,
  MilestonesStreamPaused,
  MilestonesUnpaused,
  Stream,
} from '../generated/schema'
import { getPhasesDynamicData } from './utils'

export function handleMilestonesFundsDisbursed(
  event: MilestonesFundsDisbursedEvent
): void {
  let entity = new MilestonesFundsDisbursed(
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
  const contract = Milestones.bind(event.address)
  const curMil = contract.getCurrentMilestone()

  if (stream == null) {
    log.error(
      '[handleMilestonesFundsDisbursed] Stream #{} not found. Hash: {}',
      [event.address.toString(), event.transaction.hash.toHex()]
    )
    return
  }

  if (contract) {
    stream.controller = contract.owner().toHexString()
    stream.paused = contract.paused()

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

    stream.data = getPhasesDynamicData(contract, curMil)

    stream.save()
  }

  const activity = new Activity(event.transaction.hash)
  activity.type = 'phased'
  activity.message = `Funds disbursed: ${event.address.toHexString()} amount: ${event.params.amount.toString()} recipient: ${curMil.value4.toHexString()}`
  activity.address = event.params.streamId
  activity.event = 'FundsDisbursed'
  activity.blockNumber = event.block.number
  activity.blockTimestamp = event.block.timestamp
  activity.transactionHash = event.transaction.hash
  activity.save()
}

export function handleMilestonesOwnerUpdated(
  event: MilestonesOwnerUpdatedEvent
): void {
  let entity = new MilestonesOwnerUpdated(
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
    log.error('[handleMilestonesOwnerUpdated] Stream #{} not found. Hash: {}', [
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

export function handleMilestonesPaused(event: MilestonesPausedEvent): void {
  let entity = new MilestonesPaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const stream = Stream.load(event.address)

  if (stream == null) {
    log.error('[handleMilestonesPaused] Stream #{} not found. Hash: {}', [
      event.address.toString(),
      event.transaction.hash.toHex(),
    ])
    return
  }

  stream.paused = true
  stream.save()

  const activity = new Activity(event.transaction.hash)
  activity.type = 'phased'
  activity.message = `Stream Paused: ${event.address.toHexString()} paused: true`
  activity.address = event.address
  activity.event = 'StreamPaused'
  activity.blockNumber = event.block.number
  activity.blockTimestamp = event.block.timestamp
  activity.transactionHash = event.transaction.hash
  activity.save()
}

export function handleMilestonesUnpaused(event: MilestonesUnpausedEvent): void {
  let entity = new MilestonesUnpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const stream = Stream.load(event.address)

  if (stream == null) {
    log.error('[handleMilestonesUnpaused] Stream #{} not found. Hash: {}', [
      event.address.toString(),
      event.transaction.hash.toHex(),
    ])
    return
  }

  stream.paused = false
  stream.save()

  const activity = new Activity(event.transaction.hash)
  activity.type = 'phased'
  activity.message = `Stream Unpaused: ${event.address.toHexString()} paused: false`
  activity.address = event.address
  activity.event = 'StreamUnpaused'
  activity.blockNumber = event.block.number
  activity.blockTimestamp = event.block.timestamp
  activity.transactionHash = event.transaction.hash
  activity.save()
}

export function handleMilestonesWithdraw(event: MilestonesWithdrawEvent): void {
  const activity = new Activity(event.transaction.hash)
  activity.type = 'phased'
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
