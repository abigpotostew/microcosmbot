import {
  Initialized as InitializedEvent,
  OwnerCanceled as OwnerCanceledEvent,
  OwnerPending as OwnerPendingEvent,
  OwnerUpdated as OwnerUpdatedEvent,
  StreamCreated as StreamCreatedEvent,
  Upgraded as UpgradedEvent,
} from '../generated/Manager/Manager'
import {
  Initialized,
  OwnerCanceled,
  OwnerPending,
  OwnerUpdated,
  StreamCreated,
  Upgraded,
  Stream,
  Activity,
} from '../generated/schema'

import {
  Intervals as IntervalsTemplate,
  Milestones as MilestonesTemplate,
} from '../generated/templates'
import { BigInt } from '@graphprotocol/graph-ts'

import { Milestones } from '../generated/templates/Milestones/Milestones'
import { Intervals } from '../generated/templates/Intervals/Intervals'
import { getPeriodicDynamicData, getPhasesDynamicData } from './utils'

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnerCanceled(event: OwnerCanceledEvent): void {
  let entity = new OwnerCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.canceledOwner = event.params.canceledOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnerPending(event: OwnerPendingEvent): void {
  let entity = new OwnerPending(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.pendingOwner = event.params.pendingOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnerUpdated(event: OwnerUpdatedEvent): void {
  let entity = new OwnerUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.prevOwner = event.params.prevOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStreamCreated(event: StreamCreatedEvent): void {
  let entity = new StreamCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.streamId = event.params.streamId
  entity.streamType = event.params.streamType

  const stream = new Stream(event.params.streamId)
  const activity = new Activity(event.transaction.hash)

  stream.address = event.params.streamId.toHexString()
  stream.type = event.params.streamType

  if (event.params.streamType == 'Milestones') {
    const contract = Milestones.bind(event.params.streamId)
    const milMap = contract.getCurrentMilestone()

    stream.recipient = milMap.value4.toHexString()
    stream.type = 'phased'
    stream.controller = contract.owner().toHexString()
    stream.paused = contract.paused()
    stream.token = contract.token()
    stream.botDAO = contract.botDAO()

    const balRes = contract.try_balance()
    if (!balRes.reverted) {
      stream.balance = balRes.value
    } else {
      stream.balance = BigInt.fromI32(0)
    }

    stream.data = getPhasesDynamicData(contract, milMap)

    const payRes = contract.try_nextPayment()
    if (!payRes.reverted) {
      stream.nextPayment = payRes.value
    } else {
      stream.nextPayment = BigInt.fromI32(0)
    }
    MilestonesTemplate.create(event.params.streamId)

    activity.type = 'phased'
    activity.message = `Stream created: ${event.params.streamId.toHexString()} controller: ${
      stream.controller
    } recipient: ${stream.recipient} token: ${stream.token.toHexString()}`
  } else if (event.params.streamType == 'Intervals') {
    const contract = Intervals.bind(event.params.streamId)
    const intMap = contract.getCurrentInterval()

    stream.token = contract.token()
    stream.botDAO = contract.botDAO()
    stream.recipient = intMap.value6.toHexString()
    stream.type = 'periodic'
    stream.controller = contract.owner().toHexString()
    stream.paused = contract.paused()
    stream.data = getPeriodicDynamicData(intMap)

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

    IntervalsTemplate.create(event.params.streamId)

    activity.type = 'periodic'
    activity.message = `Stream created: ${event.params.streamId.toHexString()} controller: ${
      stream.controller
    } recipient: ${stream.recipient} token: ${stream.token.toHexString()}`
  }

  stream.transactionHash = event.transaction.hash
  stream.blockTimestamp = event.block.timestamp
  stream.blockNumber = event.block.number
  stream.save()

  activity.address = event.params.streamId
  activity.event = 'StreamCreated'
  activity.blockNumber = event.block.number
  activity.blockTimestamp = event.block.timestamp
  activity.transactionHash = event.transaction.hash
  activity.save()

  entity.streamId = event.params.streamId
  entity.streamType = event.params.streamType
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.impl = event.params.impl

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
