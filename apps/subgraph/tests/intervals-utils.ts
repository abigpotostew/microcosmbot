import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  FundsDisbursed,
  IntervalsInitialized,
  IntervalsOwnerCanceled,
  IntervalsOwnerPending,
  IntervalsOwnerUpdated,
  Paused,
  IntervalsStreamCreated,
  StreamPaused,
  Unpaused
} from "../generated/Intervals/Intervals"

export function createFundsDisbursedEvent(
  streamId: Address,
  amount: BigInt,
  streamType: string
): FundsDisbursed {
  let fundsDisbursedEvent = changetype<FundsDisbursed>(newMockEvent())

  fundsDisbursedEvent.parameters = new Array()

  fundsDisbursedEvent.parameters.push(
    new ethereum.EventParam("streamId", ethereum.Value.fromAddress(streamId))
  )
  fundsDisbursedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  fundsDisbursedEvent.parameters.push(
    new ethereum.EventParam("streamType", ethereum.Value.fromString(streamType))
  )

  return fundsDisbursedEvent
}

export function createIntervalsInitializedEvent(
  version: BigInt
): IntervalsInitialized {
  let intervalsInitializedEvent = changetype<IntervalsInitialized>(
    newMockEvent()
  )

  intervalsInitializedEvent.parameters = new Array()

  intervalsInitializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return intervalsInitializedEvent
}

export function createIntervalsOwnerCanceledEvent(
  owner: Address,
  canceledOwner: Address
): IntervalsOwnerCanceled {
  let intervalsOwnerCanceledEvent = changetype<IntervalsOwnerCanceled>(
    newMockEvent()
  )

  intervalsOwnerCanceledEvent.parameters = new Array()

  intervalsOwnerCanceledEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  intervalsOwnerCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "canceledOwner",
      ethereum.Value.fromAddress(canceledOwner)
    )
  )

  return intervalsOwnerCanceledEvent
}

export function createIntervalsOwnerPendingEvent(
  owner: Address,
  pendingOwner: Address
): IntervalsOwnerPending {
  let intervalsOwnerPendingEvent = changetype<IntervalsOwnerPending>(
    newMockEvent()
  )

  intervalsOwnerPendingEvent.parameters = new Array()

  intervalsOwnerPendingEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  intervalsOwnerPendingEvent.parameters.push(
    new ethereum.EventParam(
      "pendingOwner",
      ethereum.Value.fromAddress(pendingOwner)
    )
  )

  return intervalsOwnerPendingEvent
}

export function createIntervalsOwnerUpdatedEvent(
  prevOwner: Address,
  newOwner: Address
): IntervalsOwnerUpdated {
  let intervalsOwnerUpdatedEvent = changetype<IntervalsOwnerUpdated>(
    newMockEvent()
  )

  intervalsOwnerUpdatedEvent.parameters = new Array()

  intervalsOwnerUpdatedEvent.parameters.push(
    new ethereum.EventParam("prevOwner", ethereum.Value.fromAddress(prevOwner))
  )
  intervalsOwnerUpdatedEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return intervalsOwnerUpdatedEvent
}

export function createPausedEvent(user: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )

  return pausedEvent
}

export function createIntervalsStreamCreatedEvent(
  streamId: Address,
  streamType: string
): IntervalsStreamCreated {
  let intervalsStreamCreatedEvent = changetype<IntervalsStreamCreated>(
    newMockEvent()
  )

  intervalsStreamCreatedEvent.parameters = new Array()

  intervalsStreamCreatedEvent.parameters.push(
    new ethereum.EventParam("streamId", ethereum.Value.fromAddress(streamId))
  )
  intervalsStreamCreatedEvent.parameters.push(
    new ethereum.EventParam("streamType", ethereum.Value.fromString(streamType))
  )

  return intervalsStreamCreatedEvent
}

export function createStreamPausedEvent(
  streamId: Address,
  paused: boolean
): StreamPaused {
  let streamPausedEvent = changetype<StreamPaused>(newMockEvent())

  streamPausedEvent.parameters = new Array()

  streamPausedEvent.parameters.push(
    new ethereum.EventParam("streamId", ethereum.Value.fromAddress(streamId))
  )
  streamPausedEvent.parameters.push(
    new ethereum.EventParam("paused", ethereum.Value.fromBoolean(paused))
  )

  return streamPausedEvent
}

export function createUnpausedEvent(user: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )

  return unpausedEvent
}
